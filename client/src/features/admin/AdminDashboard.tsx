import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllDoctors,
  getAllDepartments,
  getWalletSummary,
  getUnverifiedDoctors,
} from "../../services/adminService";
import { Messages } from "../../constants/messages";
import { toast } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { FaUsers, FaUserMd, FaClipboardList, FaFileInvoiceDollar } from "react-icons/fa";

interface WalletSummary {
  totalBalance: number;
  totalCommission: number;
  pendingDoctorPayouts: number;
  transactionCount?: number;
}

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [pendingDoctorVerification, setPendingDoctorVerification] = useState(0);
  const [walletSummary, setWalletSummary] = useState<WalletSummary>({
    totalBalance: 0,
    totalCommission: 0,
    pendingDoctorPayouts: 0,
    transactionCount: 0,
  });

  const pageLimit = 1; // for count calculation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersData,
          doctorsData,
          departmentsData,
          walletData,
          unverifiedDoctorsData,
        ] = await Promise.all([
          getAllUsers(1, pageLimit, "", "", "", undefined, undefined, ""), 
          getAllDoctors({ page: 1, limit: pageLimit }),
          getAllDepartments(),
          getWalletSummary(),
          getUnverifiedDoctors(1, 1000),
        ]);

        // Calculate total counts based on totalPages
        setTotalUsers(
          ((usersData.totalPages || 0) - 1) * pageLimit + (usersData.users?.length || 0)
        );

        setTotalDoctors(
          ((doctorsData.totalPages || 0) - 1) * pageLimit + (doctorsData.doctors?.length || 0)
        );

        setTotalDepartments(departmentsData.departments?.length || 0);

        setWalletSummary({
          totalBalance: walletData.totalBalance,
          totalCommission: walletData.totalCommission,
          pendingDoctorPayouts: walletData.pendingDoctorPayouts,
          transactionCount: walletData.transactionCount,
        });

        setPendingDoctorVerification(unverifiedDoctorsData.doctors?.length || 0);
      } catch (error) {
        toast.error(Messages.USER.FETCH_FAILED);
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const userDoctorData = [
    { name: "Users", value: totalUsers },
    { name: "Doctors", value: totalDoctors },
  ];

  const verifiedDoctorData = [
    { name: "Verified", value: totalDoctors - pendingDoctorVerification },
    { name: "Pending Verification", value: pendingDoctorVerification },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  const walletDataChart = [
    {
      name: "Wallet Summary",
      TotalBalance: walletSummary.totalBalance,
      PendingPayouts: walletSummary.pendingDoctorPayouts,
      Commission: walletSummary.totalCommission,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} icon={<FaUsers size={24} />} color="from-teal-400 to-teal-700" />
        <StatCard title="Total Doctors" value={totalDoctors} icon={<FaUserMd size={24} />} color="from-blue-400 to-blue-700" />
        <StatCard title="Departments" value={totalDepartments} icon={<FaClipboardList size={24} />} color="from-purple-400 to-purple-700" />
        <StatCard title="Pending Doctor Verifications" value={pendingDoctorVerification} icon={<FaFileInvoiceDollar size={24} />} color="from-orange-400 to-orange-700" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Users vs Doctors">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userDoctorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {userDoctorData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doctor Verification Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={verifiedDoctorData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {verifiedDoctorData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Wallet Summary">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={walletDataChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="TotalBalance" fill="#0088FE" />
              <Bar dataKey="PendingPayouts" fill="#FF8042" />
              <Bar dataKey="Commission" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// Gradient stat card with icon
const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
  <div className={`bg-gradient-to-r ${color} text-white shadow-lg p-6 rounded-lg flex items-center justify-between transform hover:scale-105 transition-transform`}>
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
    <div className="opacity-70">{icon}</div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow-lg p-4 rounded-lg">
    <h3 className="text-gray-700 font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default Dashboard;