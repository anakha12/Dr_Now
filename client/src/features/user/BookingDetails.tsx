import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookingDetails } from "../../services/userService";
import { motion } from "framer-motion";
import { CalendarDays, User, CreditCard, Clock, FileText, ArrowLeft } from "lucide-react";

const BookingDetails = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingDetails(bookingId);
        setBooking(res);
      } catch (error) {
        console.error("Failed to fetch booking details", error);
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
        Loading booking details...
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
        Booking not found.
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
          <Item label="Booking ID" value={booking.id} icon={<FileText size={20} />} />
          <Item label="Doctor Name" value={booking.doctorName || "N/A"} icon={<User size={20} />} />
          <Item label="Department" value={booking.department || "N/A"} icon={<User size={20} />} />
          <Item label="Date" value={booking.date} icon={<CalendarDays size={20} />} />
          <Item label="Time Slot" value={`${booking.slot?.from} - ${booking.slot?.to}`} icon={<Clock size={20} />} />
          <Item
            label="Status"
            value={booking.status}
            color={booking.status === "Cancelled" ? "text-red-500" : "text-green-600"}
            icon={<FileText size={20} />}
          />
          <Item label="Payment Status" value={booking.paymentStatus} icon={<CreditCard size={20} />} />
          <Item label="Total Amount" value={`₹${booking.totalAmount}`} icon={<CreditCard size={20} />} />
          <Item label="Booked On" value={new Date(booking.createdAt).toLocaleString()} icon={<CalendarDays size={20} />} />
           {/* Go Back Button */}
            <button
            onClick={() => navigate("/user/bookings")}
            className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-medium transition"
            >
            <ArrowLeft size={18} /> Back to My Bookings
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
