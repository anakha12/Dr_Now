

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorBookingDetails } from "../../services/doctorService";
import { motion } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import {
  CalendarDays,
  User,
  CreditCard,
  Clock,
  FileText,
  ArrowLeft,
  FileWarning,
  Landmark,
} from "lucide-react";
import { Messages } from "../../constants/messages";
import type { Booking } from "../../types/booking";

const DoctorBookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = id!;
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getDoctorBookingDetails(bookingId);
        setBooking(res);
      } catch (error) {
        addNotification(Messages.DOCTOR.BOOKING_DETAILS.FETCH_FAILED, "ERROR");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center text-lg text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {Messages.DOCTOR.BOOKING_DETAILS.LOADING}
      </motion.div>
    );
  }

  if (!booking) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center text-red-500 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {Messages.DOCTOR.BOOKING_DETAILS.NOT_FOUND}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 py-10 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 space-y-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold text-center text-teal-700 mb-4 tracking-tight">
          {Messages.DOCTOR.BOOKING_DETAILS.HEADING}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.BOOKING_ID}
            value={booking.id}
            icon={<FileText size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.PATIENT_NAME}
            value={booking.patientName ?? Messages.DOCTOR.BOOKING_DETAILS.NA}
            icon={<User size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DEPARTMENT}
            value={booking.department || Messages.DOCTOR.BOOKING_DETAILS.NA}
            icon={<Landmark size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DATE}
            value={booking.date ?? ""}
            icon={<CalendarDays size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.TIME_SLOT}
            value={`${booking.slot?.from} - ${booking.slot?.to}`}
            icon={<Clock size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.STATUS}
            value={booking.status ?? ""}
            icon={<FileText size={20} />}
            color={
              booking.status === "Cancelled"
                ? "text-red-500"
                : booking.status === "Completed"
                ? "text-green-600"
                : "text-blue-600"
            }
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.TOTAL_AMOUNT}
            value={`₹${booking.totalAmount ?? 0}`}
            icon={<CreditCard size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DOCTOR_EARNING}
            value={`₹${booking.doctorEarning || 0}`}
            icon={<CreditCard size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.COMMISSION_AMOUNT}
            value={`₹${booking.commissionAmount || 0}`}
            icon={<CreditCard size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.PAYOUT_STATUS}
            value={booking.payoutStatus || Messages.DOCTOR.BOOKING_DETAILS.PENDING}
            icon={<FileText size={20} />}
          />

          {booking.status === "Cancelled" && booking.cancellationReason && (
            <Item
              label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.CANCELLATION_REASON}
              value={booking.cancellationReason}
              icon={<FileWarning size={20} />}
              color="text-red-600"
            />
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="flex items-center gap-2 text-base text-blue-700 hover:text-blue-900 font-medium transition"
          >
            <ArrowLeft size={20} /> {Messages.DOCTOR.BOOKING_DETAILS.BACK_BUTTON}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Item = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="text-teal-600 pt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-lg font-semibold ${color || "text-gray-800"}`}>{value}</p>
    </div>
  </div>
);

export default DoctorBookingDetails;
