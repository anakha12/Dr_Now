import { useEffect, useState } from "react";
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
  const { addNotification, confirmMessage } = useNotifications();
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getDoctorBookings();
        setBookings(res);
      } catch {
        addNotification("Failed to load appointments", "error");
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    const confirm = await confirmMessage("Are you sure you want to cancel this appointment?");
    if (!confirm) return;
    try {
      await cancelDoctorBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
      );
      addNotification("Appointment cancelled", "success");
    } catch {
      addNotification("Cancellation failed", "error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-teal-700">Appointments</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto bg-white text-sm text-left">
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
                          ? "text-teal-600"
                          : "text-blue-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-sm px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
