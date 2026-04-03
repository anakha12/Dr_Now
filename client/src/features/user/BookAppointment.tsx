import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event as CalendarEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isBefore, isSameDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale/en-US";
import { handleError } from "../../utils/errorHandler"; 
import { motion, type Variants } from "framer-motion";
import { FaCalendarAlt, FaClock, FaCreditCard, FaWallet, FaUserMd } from "react-icons/fa"; 
import type { Slot } from "../../types/slot";
import type { Doctor } from "../../types/doctor";
import type { AvailabilityRule } from "../../types/availabilityRule";
import type { AvailabilityException } from "../../types/availabilityException";
import logger from "../../utils/logger";

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
import { useNotifications } from "../../hooks/useNotifications";
import { Messages, NotificationDefaults } from "../../constants/messages";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

type BookedSlot = {
  startTime?: string;
  endTime?: string;
  from?: string;
  to?: string;
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

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
  const [, setBookedSlots] = useState<Slot[]>([]);
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
        addNotification( Messages.USER.FETCH_FAILED , "ERROR");
      }
    };

    fetchData();
  }, [id, addNotification]);

  // ------------------- Fetch booked & available slots -------------------
  useEffect(() => {
    if (!selectedDate || !doctor?.id) return;

    const fetchSlots = async () => {
      try {
        
      const dateStr = format(selectedDate, "yyyy-MM-dd");
        
        const fetchedBookedSlots = await getBookedSlots(doctor.id, dateStr);
      
        setBookedSlots(fetchedBookedSlots);
        logger.log(fetchedBookedSlots)
        const dayOfWeek = selectedDate.getDay();
        const exception = exceptions.find((ex) => isSameDay(new Date(ex.date), selectedDate));

        let slots: Slot[] = [];

        if (exception?.isAvailable && exception.startTime && exception.endTime && exception.slotDuration) {
          slots = generateSlotsFromTime(exception.startTime, exception.endTime, exception.slotDuration);
        } else {
          const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
          if (rule) slots = generateSlotsFromTime(rule.startTime, rule.endTime, rule.slotDuration);
        }

        const bookedKeys = new Set(
          fetchedBookedSlots.map((b: BookedSlot) => 
            `${b.startTime || b.from}-${b.endTime || b.to}`
          )
        );

        slots = slots.map(slot => ({
          ...slot,
          booked: bookedKeys.has(`${slot.from}-${slot.to}`)
        }));

        const now = new Date();
        if (isSameDay(selectedDate, now)) {
          slots = slots.filter(slot => {
            const [sh, sm] = slot.from.split(":").map(Number);
            const slotTime = new Date(selectedDate);
            slotTime.setHours(sh, sm, 0, 0);
            return slotTime > now;
          });
        }
        setAvailableSlots(slots);
        setSelectedSlot(null);
      } catch (err) {
        console.error( Messages.USER.FAILED_FETCH_SLOT, err);
      }
    };

    fetchSlots();
  }, [selectedDate, doctor?.id, rules, exceptions]);

  // ------------------- Handle booking -------------------
  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !doctor?.id) {
      return addNotification( Messages.USER.SELECT_DATE_SLOT, "ERROR");
    }

    if (selectedSlot.booked) {
      return addNotification("This slot is already booked", "ERROR");
    }

    const consultFee = doctor.consultFee ?? 0;
    try {
      const user = await getUserProfile();
      const userId = user.id || user.userId;

      if (paymentMethod === "wallet") {
        await bookAppointmentWithWallet(
          doctor.id,
          userId,
          selectedSlot,
          consultFee,
           format(selectedDate, "yyyy-MM-dd")
        );
        addNotification(Messages.USER.APPOINTMENT_BOOKED_WALLET, "SUCCESS");
        navigate("/appointment/success");
        return;
      }

      const { sessionId } = await createStripeSession(
        doctor.id,
        userId,
        selectedSlot,
        consultFee,
         format(selectedDate, "yyyy-MM-dd")
      );
      const stripe = await stripePromise;
      if (!stripe) return addNotification( Messages.USER.STRIPE_FAILED, "ERROR");

      await stripe.redirectToCheckout({ sessionId });
    } catch (error: unknown) {
      
        const err = handleError(error, NotificationDefaults.ERROR);
        addNotification(err.message, "ERROR");
      }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full"
        />
      </div>
    );
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
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden relative pb-20">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/60 blur-3xl opacity-70"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/60 blur-3xl opacity-60"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 hover:border-teal-500 text-slate-700 font-bold shadow-sm transition-all hover:text-teal-600 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </motion.button>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Book Appointment</h2>
            <p className="text-lg text-slate-600">Select a date and time to consult with your doctor.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Doctor Info & Payment */}
            <motion.div variants={fadeInUp} className="w-full lg:w-1/3 flex flex-col gap-6">
              {/* Doctor Card */}
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-teal-500 to-emerald-600 z-0"></div>
                <div className="relative z-10 mt-6 mb-4">
                   <img
                     src={doctor.profileImage}
                     alt={doctor.name}
                     className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                   />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 capitalize mb-1">
                  Dr. {doctor.name}
                </h3>
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-bold mb-4">
                  <FaUserMd />
                  <span>{doctor.specialization || "General Specialist"}</span>
                </div>
                <div className="w-full h-px bg-slate-100 mb-4"></div>
                <div className="text-slate-600 font-medium flex items-center justify-between w-full px-4">
                  <span>Consultation Fee</span>
                  <span className="text-teal-600 font-bold text-2xl">₹{doctor.consultFee}</span>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-teal-500" /> Payment Method
                </h4>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-teal-200'}`}>
                    <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <FaCreditCard className={paymentMethod === 'stripe' ? 'text-teal-600' : 'text-slate-400'} /> Pay Online (Stripe)
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 hover:border-teal-200'}`}>
                    <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <FaWallet className={paymentMethod === 'wallet' ? 'text-teal-600' : 'text-slate-400'} /> Pay with Wallet
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Summary & Confirm Button (Desktop) */}
              <div className="hidden lg:block">
                <motion.button
                  onClick={handleBook}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
                >
                  Confirm Appointment
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column: Calendar & Slots */}
            <motion.div variants={fadeInUp} className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-500" /> Select Date
                </h4>
                <div className="calendar-container h-[450px]">
                  <style>
                    {`
                      .rbc-calendar { font-family: inherit; }
                      .rbc-toolbar button { border-radius: 8px; font-weight: 500; }
                      .rbc-toolbar button.rbc-active { background-color: #0d9488; color: white; border-color: #0d9488; }
                      .rbc-toolbar button:hover:not(.rbc-active) { background-color: #f0fdfa; color: #0f766e; }
                      .rbc-today { background-color: #f0fdfa; }
                      .rbc-event { background-color: #14b8a6; border-radius: 4px; }
                      .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9; }
                      .rbc-month-row + .rbc-month-row { border-top: 1px solid #f1f5f9; }
                      .rbc-header { padding: 10px 0; font-weight: 600; color: #475569; border-bottom: 2px solid #f1f5f9; }
                    `}
                  </style>
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
                        return { style: { backgroundColor: "#f8fafc", pointerEvents: "none", color: "#cbd5e1" } };
                      if (selectedDate && isSameDay(date, selectedDate))
                        return { style: { backgroundColor: "#ccfbf1", border: "2px solid #0d9488" } };
                      return { style: { backgroundColor: "white" } };
                    }}
                    toolbar={true}
                    popup={false}
                  />
                </div>
              </div>

              {/* Available Slots */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 mt-2"
                >
                  <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FaClock className="text-teal-500" /> Available Slots
                    <span className="text-sm font-medium text-slate-500 ml-2 bg-slate-100 px-3 py-1 rounded-full">
                      {format(selectedDate, "MMM d, yyyy")}
                    </span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, idx) => {
                        const isSelected =
                          selectedSlot?.from === slot.from &&
                          selectedSlot?.to === slot.to;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!slot.booked) setSelectedSlot(slot);
                            }}
                            disabled={slot.booked}
                            className={`py-3 px-2 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 border-2
                              ${
                                slot.booked
                                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/30 scale-105"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700"
                              }
                            `}
                          >
                            <span>{slot.from}</span>
                            <span className={`text-[10px] uppercase tracking-wider ${slot.booked ? 'text-slate-400' : isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                              {slot.booked ? 'Booked' : 'Available'}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 font-medium">No slots available for this date.</p>
                        <p className="text-sm text-slate-400 mt-1">Please select another date from the calendar</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Confirm Button (Mobile) */}
              <div className="block lg:hidden mt-4">
                <motion.button
                  onClick={handleBook}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Confirm Appointment
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookAppointment;
