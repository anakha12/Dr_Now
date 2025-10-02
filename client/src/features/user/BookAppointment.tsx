import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event as CalendarEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isBefore, isSameDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale/en-US";

import type { Slot } from "../../types/slot";
import type { Doctor } from "../../types/doctor";
import type { AvailabilityRule } from "../../types/availabilityRule";
import type { AvailabilityException } from "../../types/availabilityException";

import {
  getDoctorById,
  createStripeSession,
  getBookedSlots,
  getDoctorAvailabilityRules,
  getDoctorAvailabilityExceptions,
  getUserProfile,
  bookAppointmentWithWallet,
} from "../../services/userService";

import { loadStripe } from "@stripe/stripe-js";
import { useNotifications } from "../../context/NotificationContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">("stripe");

  const [currentDate, setCurrentDate] = useState(new Date());
  const locales = { "en-US": enUS };
  const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

  // ------------------- Generate slots -------------------
  const generateSlotsFromTime = (startTime: string, endTime: string, slotDuration: number): Slot[] => {
    const slots: Slot[] = [];
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    let current = new Date(1970, 0, 1, sh, sm);
    const end = new Date(1970, 0, 1, eh, em);

    while (current < end) {
      const next = new Date(current.getTime() + slotDuration * 60000);
      if (next > end) break;

      slots.push({
        from: `${current.getHours().toString().padStart(2, "0")}:${current.getMinutes().toString().padStart(2, "0")}`,
        to: `${next.getHours().toString().padStart(2, "0")}:${next.getMinutes().toString().padStart(2, "0")}`,
      });

      current = next;
    }

    return slots;
  };

  // ------------------- Fetch doctor, rules, exceptions -------------------
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const doctorData = await getDoctorById(id);
        setDoctor(doctorData);

        const rulesData = await getDoctorAvailabilityRules(id);
        setRules(rulesData);

        const exceptionsData = await getDoctorAvailabilityExceptions(id);
        setExceptions(exceptionsData);
      } catch {
        addNotification("Failed to load doctor info", "ERROR");
      }
    };

    fetchData();
  }, [id]);

  // ------------------- Fetch booked & available slots -------------------
  useEffect(() => {
    if (!selectedDate || !doctor?.id) return;

    const fetchSlots = async () => {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        console.log(dateStr)
        const fetchedBookedSlots = await getBookedSlots(doctor.id, dateStr);

        console.log("boked slot", fetchedBookedSlots);
        setBookedSlots(fetchedBookedSlots);

        const dayOfWeek = selectedDate.getDay();
        const exception = exceptions.find((ex) => isSameDay(new Date(ex.date), selectedDate));

        let slots: Slot[] = [];

        if (exception?.isAvailable && exception.startTime && exception.endTime && exception.slotDuration) {
          slots = generateSlotsFromTime(exception.startTime, exception.endTime, exception.slotDuration);
        } else {
          const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
          if (rule) slots = generateSlotsFromTime(rule.startTime, rule.endTime, rule.slotDuration);
        }

        // ❌ FIX: remove slots already booked from DB
        const bookedKeys = new Set(
          fetchedBookedSlots.map((b: any) => `${b.startTime || b.from}-${b.endTime || b.to}`)
        );

        slots = slots.filter(slot => !bookedKeys.has(`${slot.from}-${slot.to}`));

        // ❌ Remove past slots for today
        const now = new Date();
        if (isSameDay(selectedDate, now)) {
          slots = slots.filter(slot => {
            const [sh, sm] = slot.from.split(":").map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(sh, sm, 0, 0);
            return slotTime > now;
          });
        }

        console.log("slots available", slots);
        setAvailableSlots(slots);
        setSelectedSlot(null);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      }
    };

    fetchSlots();
  }, [selectedDate, doctor?.id, rules, exceptions]);

  // ------------------- Handle booking -------------------
  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !doctor?.id) {
      return addNotification("Please select date and slot", "ERROR");
    }

    try {
      const user = await getUserProfile();
      const userId = user.id || user.userId;

      if (paymentMethod === "wallet") {
        await bookAppointmentWithWallet(
          doctor.id,
          userId,
          selectedSlot,
          doctor.consultFee,
          selectedDate.toISOString()
        );
        addNotification("Appointment booked using wallet!", "SUCCESS");
        navigate("/user/appointment/success");
        return;
      }

      const { sessionId } = await createStripeSession(
        doctor.id,
        userId,
        selectedSlot,
        doctor.consultFee,
        selectedDate.toISOString()
      );
      const stripe = await stripePromise;
      if (!stripe) return addNotification("Stripe initialization failed", "ERROR");

      await stripe.redirectToCheckout({ sessionId });
    } catch (error: any) {
      console.error("Booking error:", error);
      addNotification(error?.response?.data?.message || error.message || "Something went wrong", "ERROR");
    }
  };

  if (!doctor) {
    return <div className="text-center py-20 text-lg text-teal-600">Loading doctor info...</div>;
  }

  // ------------------- Prepare calendar events -------------------
  const today = new Date();
  const events: CalendarEvent[] = [];
  const nextDays = 60;

  for (let i = 0; i < nextDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayRule = rules.find(r => r.dayOfWeek === date.getDay());
    const exception = exceptions.find(ex => isSameDay(new Date(ex.date), date) && ex.isAvailable);

    if (dayRule || exception) {
      events.push({
        start: date,
        end: date,
        title: "",
        allDay: true,
      });
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book Appointment</h2>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-teal-100">
        {/* Doctor Info */}
        <div className="flex items-center gap-4">
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Dr. {doctor.name}</h3>
            <p className="text-sm text-teal-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">₹{doctor.consultFee} Fee</p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "stripe" | "wallet")}
            className="w-full border border-gray-300 rounded px-2 py-2 focus:ring-2 focus:ring-teal-400"
          >
            <option value="stripe">Pay Online (Stripe)</option>
            <option value="wallet">Pay with Wallet</option>
          </select>
        </div>

        {/* Calendar */}
        <div style={{ height: 450 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            selectable
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            onSelectEvent={(event) => event.start && setSelectedDate(event.start)}
            onSelectSlot={(slotInfo) => {
              if (isBefore(slotInfo.start, today)) return;
              setSelectedDate(slotInfo.start);
            }}
            dayPropGetter={(date) => {
              if (isBefore(date, today))
                return { style: { backgroundColor: "#f5f5f5", pointerEvents: "none" } };
              return { style: { backgroundColor: "white" } };
            }}
            toolbar={true}
            popup={false}
          />
        </div>

        {/* Available Slots */}
        {selectedDate && (
          <div>
            <h4 className="font-semibold mb-2">Available Slots for {selectedDate.toDateString()}</h4>
            <div className="flex flex-wrap gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => {
                  const isSelected =
                    selectedSlot?.from === slot.from && selectedSlot?.to === slot.to;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        isSelected
                          ? "bg-teal-600 text-white border-teal-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-teal-50"
                      }`}
                    >
                      {slot.from} - {slot.to}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 italic mt-2">
                  No slots available for this date.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleBook}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default BookAppointment;
