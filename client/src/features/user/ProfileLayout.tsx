import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../../redux/slices/authSlice";
import { profileSidebarItems } from "../../constants/sidebar";
import { socket } from "../../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaWallet,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState, useEffect } from "react";

const getIcon = (key: string) => {
  switch (key) {
    case "profile": return <FaUser className="w-5 h-5" />;
    case "bookings": return <FaCalendarAlt className="w-5 h-5" />;
    case "fund-request": return <FaHandHoldingHeart className="w-5 h-5" />;
    case "wallet": return <FaWallet className="w-5 h-5" />;
    case "logout": return <FaSignOutAlt className="w-5 h-5" />;
    default: return <FaUser className="w-5 h-5" />;
  }
};

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const active = location.pathname.split("/")[2] || "profile";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      socket.disconnect(); 
      dispatch(userLogout());
      navigate("/login");
    } else {
      navigate(`/${key}`);
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
      <div className="lg:hidden sticky top: 72px left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-40 flex items-center justify-between px-6 py-4 shadow-sm">
        <h2 className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Menu</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/50"
        >
          {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Layout Container */}
      <div className="flex-1 w-full max-w-400 mx-auto relative z-10 lg:pt-24 px-4 lg:px-8 pb-12 flex gap-8">
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-80 transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out lg:transform-none lg:flex lg:flex-col
          h-full lg:h-[calc(100vh-8rem)]
        `}>
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-r-3xl lg:rounded-3xl p-6 lg:p-8 flex flex-col h-full overflow-y-auto mt: 72px lg:mt-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">My Profile</h2>
              <p className="text-slate-500 font-medium text-sm">Manage your health preferences</p>
            </div>

            <nav className="space-y-3 flex-1 flex flex-col pt-4 lg:pt-0">
              {profileSidebarItems.map((item) => {
                const isActive = active === item.key;
                const isLogout = item.key === "logout";
                return (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.key}
                    onClick={() => handleSidebarClick(item.key)}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all
                      ${isActive 
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30" 
                        : isLogout
                          ? "text-rose-600 hover:bg-rose-50 mt-auto border border-rose-100/50 hover:border-rose-200"
                          : "text-slate-600 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 border border-transparent hover:border-slate-100"
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-xl transition-colors
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : isLogout 
                          ? 'bg-rose-100 text-rose-500' 
                          : 'bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-teal-500'
                      }
                    `}>
                      {getIcon(item.key)}
                    </div>
                    {item.label}
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
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden mt: 72px"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Page content */}
        <main className="flex-1 w-full flex flex-col min-h-[calc(100vh-6rem)] lg:min-h-0 lg:h-[calc(100vh-8rem)]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white/60 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 border-radius: 2rem; overflow-x-hidden overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
