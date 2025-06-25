import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cancelUserBooking, getUserBookings } from "../../services/userService";
import { useNotifications } from "../../context/NotificationContext";

interface Booking {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  amount: number;
  status: string;
  paymentStatus: string;
  canCancel: boolean;
}

const ITEMS_PER_PAGE = 4;

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addNotification, confirmMessage } = useNotifications();

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookings();
        setBookings(res);
      } catch (error) {
        addNotification("Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [addNotification]);

  const handleCancel = async (bookingId: string) => {
    const confirmed = await confirmMessage("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    try {
      await cancelUserBooking(bookingId);
      addNotification("Booking cancelled", "success");
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled", canCancel: false } : b))
      );
    } catch (err) {
      addNotification("Cancellation failed", "error");
    }
  };

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <motion.h1
        className="text-3xl font-bold text-teal-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Bookings
      </motion.h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-5 space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-lg text-teal-700">
                      Dr. {booking.doctorName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Date: <span className="font-medium">{booking.date}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: <span className="font-medium">{booking.time}</span>
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          booking.status === "Cancelled"
                            ? "text-red-500"
                            : booking.status === "Completed"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center">
                    {booking.status !== "Cancelled" && booking.canCancel && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {bookings.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBookings;
