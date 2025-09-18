import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale/en-US";
import type { AvailabilityRule } from "../../types/availabilityRule";
import type { AvailabilityException } from "../../types/availabilityException";
import type { Slot } from "../../types/slot";
import type { Doctor } from "../../types/doctor";

import {
  getDoctorById,
  getBookedSlots,
  getDoctorAvailabilityRules,
  getDoctorAvailabilityExceptions,
  getUserProfile,
  bookAppointmentWithWallet,
  createStripeSession,
} from "../../services/userService";

import { loadStripe } from "@stripe/stripe-js";
import { useNotifications } from "../../context/NotificationContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});




// Generate slots based on start, end, and duration
const generateSlotsFromTime = (startTime: string, endTime: string, slotDuration: number) => {
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

const BookAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "wallet">("stripe");
  const { addNotification } = useNotifications();

  // Fetch doctor info, rules, exceptions
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const doctorData = await getDoctorById(id);
        setDoctor(doctorData);

        const rulesData = await getDoctorAvailabilityRules(id);
        setRules(rulesData);

        const exceptionsData = await getDoctorAvailabilityExceptions(id);
        setExceptions(exceptionsData);
      } catch {
        addNotification("Failed to load doctor info", "error");
      }
    };
    fetchData();
  }, [id]);

  // Fetch booked slots for selected date
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !doctor?.id) return;
      const dateStr = selectedDate.toISOString().split("T")[0];
      try {
        const data = await getBookedSlots(doctor.id, dateStr);
        setBookedSlots(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookedSlots();
  }, [selectedDate, doctor?.id]);

  // Compute available slots whenever date, rules, exceptions, or booked slots change
  useEffect(() => {
    if (!selectedDate) return;

    const dayOfWeek = selectedDate.getDay();
    const exception = exceptions.find(
      (ex) => new Date(ex.date).toDateString() === selectedDate.toDateString()
    );

    let slots: Slot[] = [];
    if (exception && exception.isAvailable && exception.startTime && exception.endTime && exception.slotDuration) {
      slots = generateSlotsFromTime(exception.startTime, exception.endTime, exception.slotDuration);
    } else {
      const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
      if (rule) {
        slots = generateSlotsFromTime(rule.startTime, rule.endTime, rule.slotDuration);
      }
    }

    // Remove booked slots
    let filteredSlots = slots.filter(
      (slot) => !bookedSlots.some((b) => b.from === slot.from && b.to === slot.to)
    );

    // Remove past slots if selected date is today
    const now = new Date();
    if (selectedDate.toDateString() === now.toDateString()) {
      filteredSlots = filteredSlots.filter((slot) => {
        const [sh, sm] = slot.from.split(":").map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(sh, sm, 0, 0);
        return slotTime > now;
      });
    }

    setAvailableSlots(filteredSlots);
    setSelectedSlot(null);
  }, [selectedDate, rules, exceptions, bookedSlots]);

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !doctor?.id) {
      return addNotification("Please select date and slot", "error");
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
        addNotification("Appointment booked using wallet!", "success");
        setTimeout(() => window.location.reload(), 1500);
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
      if (!stripe) return addNotification("Stripe initialization failed", "error");
      await stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      console.error(err);
      addNotification(err?.response?.data?.message || err.message || "Booking failed", "error");
    }
  };

  if (!doctor) return <div className="text-center py-20 text-lg text-teal-600">Loading doctor info...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Book Appointment</h2>

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5 border border-teal-100">
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
        <div style={{ height: 380 }}>
          <Calendar
            localizer={localizer}
            defaultView="month"
            views={["month"]}
            selectable
            events={[]}
            onSelectSlot={(slotInfo: any) => {
              const selected = new Date(slotInfo.start);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (selected < today) {
                addNotification("Cannot select past dates", "error");
                return;
              }
              setSelectedDate(selected);
            }}
            components={{ toolbar: () => null }}
            dayPropGetter={(date) => {
              const today = new Date();
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              const isPast = date < today;

              let bgColor = "#fff";
              let textColor = "#333";

              if (isPast) {
                bgColor = "#F3F4F6"; // greyed out
                textColor = "#9CA3AF";
              } else if (isSelected) {
                bgColor = "#14B8A6";
                textColor = "#fff";
              } else if (isToday) {
                bgColor = "#D1FAE5"; // highlight today
                textColor = "#047857";
              }

              return {
                style: {
                  backgroundColor: bgColor,
                  color: textColor,
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  cursor: isPast ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: isToday ? 600 : 400,
                  transition: "all 0.2s",
                },
              };
            }}
          />
        </div>

        {/* Slots */}
        {selectedDate && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Available Slots</label>
            <div className="flex flex-wrap gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => {
                  const isSelected = selectedSlot?.from === slot.from && selectedSlot?.to === slot.to;
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
                <p className="text-sm text-gray-500 italic mt-2">No slots available for this date.</p>
              )}
            </div>
          </div>
        )}

        {/* Confirm Booking */}
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
