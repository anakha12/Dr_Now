import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorBookings, cancelDoctorBooking } from "../../services/doctorService";
import { useNotifications } from "../../context/NotificationContext";

interface Booking {
  id: string;
  patientName: string;
  date: string;
  slot: {
    from: string;
    to: string;
  };
  status: string;
  paymentStatus: string;
}

const DoctorAppointments = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const { addNotification, confirmMessage, promptInput } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getDoctorBookings(currentPage, itemsPerPage);
        setBookings(res.bookings || []);
        setTotalPages(res.totalPages || 1);
      } catch {
        addNotification("Failed to load appointments", "error");
      }
    };

    fetchBookings();
  }, [currentPage]);

  const handleCancel = async (bookingId: string) => {
    const confirm = await confirmMessage("Are you sure you want to cancel this appointment?");
    if (!confirm) return;

    const reason= await promptInput("Please enter the reason for cancellation", "e.g., Emergency");

    if (!reason || reason.trim() === "") {
      return addNotification("Cancellation reason is required", "warning");
    }
    try {
      await cancelDoctorBooking(bookingId,reason);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
      );
      addNotification("Appointment cancelled", "success");
    } catch {
      addNotification("Cancellation failed", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">My Appointments</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-teal-100 text-teal-700 font-semibold">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.patientName}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">{`${b.slot?.from} - ${b.slot?.to}`}</td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        b.status === "Cancelled"
                          ? "text-rose-500"
                          : b.status === "Completed"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-sm px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/doctor/bookings/${b.id}`)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
