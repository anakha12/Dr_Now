import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingDetails } from "../../services/userService";
import { motion } from "framer-motion";
import { CalendarDays, User, CreditCard, Clock, FileText, ArrowLeft, FileText as PrescriptionIcon } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages } from "../../constants/messages";
import logger from "../../utils/logger";
import type { Booking } from "../../types/booking";

const BookingDetails = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingDetails(bookingId);
        if (!res) {
          addNotification(Messages.DOCTOR.BOOKING_DETAILS.NOT_FOUND, "ERROR");
          setBooking(null);
        } else {
          setBooking(res);
        }
      } catch (error) {
        logger.error(error);
        addNotification(Messages.DOCTOR.BOOKING_DETAILS.NOT_FOUND, "ERROR");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, addNotification]);

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
          Booking Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
          <Item label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.BOOKING_ID} value={booking.id} icon={<FileText size={20} />} />
          <Item label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DOCTOR_NAME} value={booking.doctorName || "N/A"} icon={<User size={20} />} />
          <Item label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DEPARTMENT} value={booking.department || "N/A"} icon={<User size={20} />} />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.DATE}
            value={booking.date ? new Date(booking.date).toLocaleDateString("en-GB") : "N/A"}
            icon={<CalendarDays size={20} />}
          />
          <Item label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.TIME_SLOT} value={`${booking.slot?.from} - ${booking.slot?.to}`} icon={<Clock size={20} />} />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.STATUS}
            value={booking.status ?? "N/A"}
            color={booking.status === "Cancelled" ? "text-red-500" : "text-green-600"}
            icon={<FileText size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.PAYMENT_STATUS}
            value={booking.payoutStatus ?? "N/A"} 
            icon={<CreditCard size={20} />}
          />
          <Item
            label={Messages.DOCTOR.BOOKING_DETAILS.LABELS.TOTAL_AMOUNT}
            value={`₹${(booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0)}`}
            icon={<CreditCard size={20} />}
          />

          {/* Navigate to Prescription Page */}
          {booking.prescription && (
            <button
              onClick={() =>
                navigate("/user/prescription", {
                  state: {
                    prescription: booking.prescription,
                    patientName: booking.patientName ?? "Patient",
                    department: booking.department || "N/A",
                  },
                })
              }
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium mt-4"
            >
              <PrescriptionIcon size={18} /> View Prescription
            </button>
          )}

          {/* Go Back Button */}
          <button
            onClick={() => navigate("/user/bookings")}
            className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium mt-4"
          >
            <ArrowLeft size={18} /> {Messages.DOCTOR.BOOKING_DETAILS.BACK_BUTTON}
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

export default BookingDetails;