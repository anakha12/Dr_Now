import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cancelUserBooking, getUserBookings } from "../../services/userService"; // you must define these
import { toast } from "react-hot-toast";


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


const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookings();
        setBookings(res);
      } catch (error) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelUserBooking(bookingId);
      toast.success("Booking cancelled");
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status: "Cancelled", canCancel: false } : b))
      );
    } catch (err) {
      toast.error("Cancellation failed");
    }
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
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              className="bg-white rounded-xl shadow-md p-5 space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                  {/* <p className="text-sm text-gray-600">
                    Amount Paid: ₹<span className="font-medium">{booking.amount}</span>
                  </p> */}
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
      )}
    </div>
  );
};

export default UserBookings;
