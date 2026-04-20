import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store";
import { Messages } from "../../constants/messages";
import { adminSidebarItems } from "../../constants/sidebar";
import { AdminRoutes } from "../../constants/routes";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartPie,
  FaUserCheck,
  FaUserMd,
  FaHospitalAlt,
  FaUsers,
  FaFileInvoiceDollar,
  FaHandHoldingHeart,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState, useEffect } from "react";

const getIcon = (key: string) => {
  switch (key) {
    case "dashboard": return <FaChartPie className="w-5 h-5" />;
    case "doctor-verification": return <FaUserCheck className="w-5 h-5" />;
    case "doctors": return <FaUserMd className="w-5 h-5" />;
    case "departments": return <FaHospitalAlt className="w-5 h-5" />;
    case "patients": return <FaUsers className="w-5 h-5" />;
    case "doctor-payment": return <FaFileInvoiceDollar className="w-5 h-5" />;
    case "crowdfunding-verification": return <FaHandHoldingHeart className="w-5 h-5" />;
    case "logout": return <FaSignOutAlt className="w-5 h-5" />;
    default: return <FaChartPie className="w-5 h-5" />;
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const active = location.pathname.split("/")[2] || "dashboard";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSidebarClick = async (key: string) => {
    if (key === "logout") {
      dispatch(adminLogout());
      await persistor.purge();
      toast.success(Messages.AUTH.LOGOUT_SUCCESS);
      navigate(AdminRoutes.LOGIN);
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden flex flex-col">
      {/* Background Blobs for consistent theme */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/30 blur-3xl opacity-60"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-200/30 blur-3xl opacity-50"
        />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 flex items-center justify-between px-6 py-4 shadow-sm">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">Admin Panel</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        >
          {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Layout Container */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto relative z-10 lg:pt-8 px-4 lg:px-8 pb-12 flex gap-8">
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80 transform 
          ${isMobileMenuOpen ? 'translate-x-0 mt-[65px]' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out lg:transform-none lg:flex lg:flex-col
          h-[calc(100vh-65px)] lg:h-[calc(100vh-4rem)]
        `}>
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-r-[2rem] lg:rounded-[2rem] p-6 flex flex-col h-full overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="hidden lg:block mb-8 px-2">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Admin Panel</h2>
              <p className="text-slate-500 font-medium text-sm">System Management</p>
            </div>

            <nav className="space-y-2 flex-1 flex flex-col pt-2 lg:pt-0">
              {adminSidebarItems.map((item) => {
                const isActive = active === item.key;
                const isLogout = item.key === "logout";
                return (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.key}
                    onClick={() => handleSidebarClick(item.key)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 sm:py-4 rounded-2xl font-bold transition-all
                      ${isActive 
                        ? "bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-lg shadow-teal-500/30" 
                        : isLogout
                          ? "text-rose-600 hover:bg-rose-50 mt-auto border border-rose-100/50 hover:border-rose-200"
                          : "text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-100"
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-xl transition-colors shrink-0
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : isLogout 
                          ? 'bg-rose-100 text-rose-500' 
                          : 'bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-teal-500'
                      }
                    `}>
                      {getIcon(item.key)}
                    </div>
                    <span className="text-left leading-tight">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Backdrop for Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden mt-[65px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-65px)] lg:min-h-0 lg:h-[calc(100vh-4rem)]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white/60 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-x-hidden overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminLayout;
