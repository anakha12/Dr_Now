import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cancelUserBooking, getUserBookings } from "../../services/userService";
import { useNotifications } from "../../context/NotificationContext";
import type { Booking } from "../../types/booking";
import { Messages } from "../../constants/messages";

const ITEMS_PER_PAGE = 4;

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addNotification, confirmMessage, promptInput } = useNotifications();
  const navigate = useNavigate();

  const fetchBookings = async (page: number) => {
    setLoading(true);
    try {
      const res = await getUserBookings(page, ITEMS_PER_PAGE);
      setBookings(res.bookings);
      setTotalPages(res.totalPages);
    } catch (error) {
      addNotification(Messages.DOCTOR.APPOINTMENTS.FETCH_FAILED, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handleCancel = async (bookingId: string) => {
    const confirmed = await confirmMessage(Messages.DOCTOR.APPOINTMENTS.CONFIRM_CANCEL);
    if (!confirmed) return;

    const reason = await promptInput(
      Messages.DOCTOR.APPOINTMENTS.PROMPT_CANCEL_REASON,
      Messages.DOCTOR.APPOINTMENTS.PROMPT_CANCEL_PLACEHOLDER
    );
    if (!reason || reason.trim() === "") {
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_REASON_REQUIRED, "WARNING");
      return;
    }

    try {
      await cancelUserBooking(bookingId, reason);
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_SUCCESS, "SUCCESS");
      fetchBookings(currentPage);
    } catch (err) {
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_FAILED, "ERROR");
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "bg-red-100 text-red-600 border-red-300";
      case "Completed":
        return "bg-green-100 text-green-600 border-green-300";
      default:
        return "bg-blue-100 text-blue-600 border-blue-300";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.h1
        className="text-4xl font-bold text-indigo-800 mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Bookings
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No bookings found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h2 className="text-xl font-bold text-indigo-700 mb-2">
                  Dr. {booking.doctorName}
                </h2>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Department:</strong> {booking.department}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${statusColor(booking.status || "Pending")}`}
                    >
                      {booking.status || Messages.DOCTOR.BOOKING_DETAILS.PENDING}
                    </span>
                  </p>
                  <p><strong>Amount:</strong> ₹{booking.amount}</p>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  {booking.status !== "Cancelled" && booking.canCancel && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/user/bookings/${booking.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-5 py-2 bg-gray-300 rounded-full text-sm font-medium hover:bg-gray-400 disabled:opacity-50 transition"
              >
                ← Previous
              </button>
              <span className="text-gray-700 text-sm">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-gray-300 rounded-full text-sm font-medium hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBookings;
