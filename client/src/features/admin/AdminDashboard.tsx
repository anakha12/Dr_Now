import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  getAllUsers,
  getAllDoctors,
  getWalletSummary,
  getDashboardAnalytics,
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
  AreaChart,
  Area,
} from "recharts";
import { FaUsers, FaUserMd, FaChartLine, FaRegTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface WalletSummary {
  totalBalance: number;
  totalCommission: number;
  pendingDoctorPayouts: number;
  transactionCount?: number;
}

interface AnalyticsData {
  bookingStatusBreakdown: { status: string; count: number }[];
  revenueTrend: { date: string; revenue: number }[];
  departmentPopularity: { department: string; count: number }[];
  topDoctors: { doctorId: string; doctorName: string; earnings: number; consultations: number }[];
  cancellationRate: number;
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
  const [walletSummary, setWalletSummary] = useState<WalletSummary>({
    totalBalance: 0,
    totalCommission: 0,
    pendingDoctorPayouts: 0,
    transactionCount: 0,
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const pageLimit = 1; // for count calculation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersData,
          doctorsData,
          walletData,
          analyticsData,
        ] = await Promise.all([
          getAllUsers(1, pageLimit, "", "", "", undefined, undefined, ""), 
          getAllDoctors({ page: 1, limit: pageLimit }),
          getWalletSummary(),
          getDashboardAnalytics(),
        ]);

        // Calculate total counts based on totalPages
        setTotalUsers(
          ((usersData.totalPages || 0) - 1) * pageLimit + (usersData.users?.length || 0)
        );

        setTotalDoctors(
          ((doctorsData.totalPages || 0) - 1) * pageLimit + (doctorsData.doctors?.length || 0)
        );

        setWalletSummary({
          totalBalance: walletData.totalBalance,
          totalCommission: walletData.totalCommission,
          pendingDoctorPayouts: walletData.pendingDoctorPayouts,
          transactionCount: walletData.transactionCount,
        });

        setAnalytics(analyticsData);
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

  const PIE_COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
  const STATUS_COLORS = ["#10b981", "#3b82f6", "#ef4444"]; 
  const REVENUE_CHART_COLOR = "#3b82f6";

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

        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={walletSummary.totalCommission} 
            prefix="₹"
            icon={<FaChartLine size={28} />} 
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
            title="Total Users" 
            value={totalUsers} 
            icon={<FaUsers size={28} />} 
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            shadowColor="shadow-blue-500/30"
          />
          <StatCard 
            title="Cancellation Rate" 
            value={analytics?.cancellationRate || 0} 
            suffix="%"
            icon={<FaRegTimesCircle size={28} />} 
            color="bg-gradient-to-br from-rose-500 to-rose-700"
            shadowColor="shadow-rose-500/30"
          />
        </motion.div>

        {/* Analytics Section 1 */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Revenue Trend (Last 30 Days)">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.revenueTrend || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={REVENUE_CHART_COLOR} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={REVENUE_CHART_COLOR} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={REVENUE_CHART_COLOR} fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Department Popularity">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.departmentPopularity || []} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="department" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={100} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
        </motion.div>

        {/* Charts */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <ChartCard title="Booking Status Overview">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics?.bookingStatusBreakdown || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {(analytics?.bookingStatusBreakdown || []).map((_, index) => (
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

          <ChartCard title="Top Performing Doctors">
            <div className="space-y-4">
              {(analytics?.topDoctors || []).map((doc, idx) => (
                <div key={doc.doctorId} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">Dr. {doc.doctorName}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{doc.consultations} Consultations</p>
                    </div>
                  </div>
                  <p className="font-bold text-teal-600 text-sm">₹{doc.earnings.toLocaleString()}</p>
                </div>
              ))}
              {(!analytics || analytics.topDoctors.length === 0) && (
                 <p className="text-center text-slate-400 py-10">No doctor data yet</p>
              )}
            </div>
          </ChartCard>

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

        </motion.div>
      </motion.div>
    </div>
  );
};

// Gradient stat card with hover animations
const StatCard = ({ title, value, icon, color, shadowColor, prefix = "", suffix = "" }: { title: string; value: number; icon: ReactNode; color: string; shadowColor: string; prefix?: string; suffix?: string }) => (
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
        <h3 className="text-4xl font-extrabold">{prefix}{value.toLocaleString()}{suffix}</h3>
      </div>
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
        {icon}
      </div>
    </div>
  </motion.div>
);

// Chart card with glassmorphic container padding
const ChartCard = ({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) => (
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