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
import { motion, type Variants } from "framer-motion";

interface WalletSummary {
  totalBalance: number;
  totalCommission: number;
  pendingDoctorPayouts: number;
  transactionCount?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

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

  const PIE_COLORS = ["#14b8a6", "#3b82f6"]; // Teal and Blue
  const STATUS_COLORS = ["#10b981", "#f59e0b"]; // Emerald and Amber
  const BAR_COLORS = ["#3b82f6", "#f59e0b", "#14b8a6"]; // Blue, Amber, Teal

  const walletDataChart = [
    {
      name: "Wallet Stats",
      TotalBalance: walletSummary.totalBalance,
      PendingPayouts: walletSummary.pendingDoctorPayouts,
      Commission: walletSummary.totalCommission,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 mt-1">Platform analytics and financial summary.</p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={totalUsers} 
            icon={<FaUsers size={28} />} 
            color="bg-gradient-to-br from-indigo-500 to-indigo-700"
            shadowColor="shadow-indigo-500/30"
          />
          <StatCard 
            title="Total Doctors" 
            value={totalDoctors} 
            icon={<FaUserMd size={28} />} 
            color="bg-gradient-to-br from-teal-500 to-teal-700"
            shadowColor="shadow-teal-500/30"
          />
          <StatCard 
            title="Departments" 
            value={totalDepartments} 
            icon={<FaClipboardList size={28} />} 
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            shadowColor="shadow-blue-500/30"
          />
          <StatCard 
            title="Pending Approvals" 
            value={pendingDoctorVerification} 
            icon={<FaFileInvoiceDollar size={28} />} 
            color="bg-gradient-to-br from-rose-500 to-rose-700"
            shadowColor="shadow-rose-500/30"
          />
        </motion.div>

        {/* Charts */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <ChartCard title="Platform Demographics">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userDoctorData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {userDoctorData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ color: '#334155', fontWeight: 600 }}
                />
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
                  innerRadius={60}
                  outerRadius={85}
                  label={({ name, percent = 0 }) => `${String(name || '').split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {verifiedDoctorData.map((_, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#334155', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Wallet Summary (₹)" className="lg:col-span-1">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={walletDataChart} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="TotalBalance" name="Total Balance" fill={BAR_COLORS[0]} radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="PendingPayouts" name="Pending Payouts" fill={BAR_COLORS[1]} radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="Commission" name="Commission" fill={BAR_COLORS[2]} radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </motion.div>
      </motion.div>
    </div>
  );
};

// Gradient stat card with hover animations
const StatCard = ({ title, value, icon, color, shadowColor }: { title: string; value: number; icon: React.ReactNode; color: string; shadowColor: string }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl ${shadowColor}`}
  >
    <div className={`absolute inset-0 ${color} opacity-90`} />
    <svg className="absolute right-0 top-0 h-full w-1/2 opacity-20 transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none">
       <polygon fill="currentColor" points="0,100 100,0 100,100" />
    </svg>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold">{value.toLocaleString()}</h3>
      </div>
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
        {icon}
      </div>
    </div>
  </motion.div>
);

// Chart card with glassmorphic container padding
const ChartCard = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <motion.div 
    variants={itemVariants}
    className={`bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2rem] p-6 lg:p-8 hover:shadow-2xl transition-shadow ${className}`}
  >
    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
      <span className="w-2 h-6 bg-teal-500 rounded-full inline-block"></span>
      {title}
    </h3>
    {children}
  </motion.div>
);

export default Dashboard;