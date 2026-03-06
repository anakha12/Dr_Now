// src/pages/Doctor/DoctorDashboard.tsx
import { useEffect, useState } from "react";
import { getDoctorBookings, getWalletSummary } from "../../services/doctorService";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";

import type { Booking } from "../../types/booking";
import type { WalletTransaction } from "../../types/WalletTransaction";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { FaClipboardList, FaCalendarCheck, FaCheckCircle, FaTimesCircle, FaWallet } from "react-icons/fa";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DoctorDashboard = () => {
  const { addNotification } = useNotifications();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsData, walletData] = await Promise.all([
          getDoctorBookings(1, 100),
          getWalletSummary(1, 100),
        ]);

        setBookings(bookingsData.bookings || []);
        setWalletBalance(walletData.walletBalance);
        setTransactions(walletData.transactions || []);
      } catch (error) {
        addNotification(Messages.DOCTOR.FETCH_FAILED, "ERROR");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addNotification]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 text-lg">Loading dashboard...</p>
    );

  const now = new Date();

  // Metrics
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => b.date && new Date(b.date) >= now
  ).length;
  const completedBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status?.toLowerCase() === "cancelled"
  ).length;

  const totalEarned = transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.amount, 0);

  // Pie Chart Data
  const bookingPieData = [
    { name: "Upcoming", value: upcomingBookings },
    { name: "Completed", value: completedBookings },
    { name: "Cancelled", value: cancelledBookings },
  ];

  // Wallet Bar Chart Data
  const walletBarData = transactions.slice(0, 5).map((t) => ({
    name: t.date ? new Date(t.date).toLocaleDateString("en-IN") : "-",
    amount: t.amount,
  }));

  // Upcoming Appointments (sorted)
  const upcomingAppointments = bookings
    .filter((b) => b.date && new Date(b.date) >= now)
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  // Helper to format booking date safely
  const formatBookingDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 space-y-8">
      <h1 className="text-3xl font-bold text-teal-700 text-center mb-6">
        Doctor Dashboard
      </h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <FaClipboardList className="text-teal-500 text-3xl mb-2" />
          <p className="text-gray-500 font-medium">Total Bookings</p>
          <p className="text-2xl font-bold text-teal-600">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <FaCalendarCheck className="text-blue-500 text-3xl mb-2" />
          <p className="text-gray-500 font-medium">Upcoming</p>
          <p className="text-2xl font-bold text-blue-500">{upcomingBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <FaCheckCircle className="text-green-500 text-3xl mb-2" />
          <p className="text-gray-500 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-500">{completedBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <FaTimesCircle className="text-red-500 text-3xl mb-2" />
          <p className="text-gray-500 font-medium">Cancelled</p>
          <p className="text-2xl font-bold text-red-500">{cancelledBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center hover:shadow-lg transition">
          <FaWallet className="text-yellow-500 text-3xl mb-2" />
          <p className="text-gray-500 font-medium">Total Earned</p>
          <p className="text-2xl font-bold text-yellow-500">
            ₹{totalEarned.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-teal-700 mb-4">Bookings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {bookingPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-teal-700 mb-4">Recent Wallet Transactions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={walletBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
        <h2 className="text-xl font-bold text-teal-700 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {upcomingAppointments.map((b) => (
              <div key={b.id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                <p className="font-semibold text-teal-700">{b.patientName}</p>
                <p className="text-gray-600 text-sm">{b.department} — {b.status}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {formatBookingDate(b.date)} | {b.slot?.from} - {b.slot?.to}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;