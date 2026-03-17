import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile, logoutUser } from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store";
import type { RootState } from "../../redux/store";
// import { socket } from "../../services/socket";
import { motion, AnimatePresence } from "framer-motion";
import logger from "../../utils/logger";

const UserLayout = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.userAuth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        setUser(null);
        logger.error(err);
      }
    };
    fetchUser();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated]);

  // Logout handler
const handleLogout = async () => {

  await logoutUser(); 
  // if (socket && typeof socket.disconnect === "function") {
    
  //   socket.disconnect();
   
  // } else {
    
  // }

  dispatch(userLogout()); 
  await persistor.purge();
  setUser(null);
  navigate("/login", { replace: true });

};

  const navLinks = [
    { name: "Home", path: "/user/dashboard" },
    { name: "About", path: "/user/about" },
    { name: "Contact", path: "/user/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 selection:bg-teal-100">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
          {/* Logo */}
          <Link to="/user/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:-translate-y-0.5">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              Dr<span className="text-teal-600">Now</span>
            </h1>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-bold transition-all relative py-2 ${
                      isActive
                        ? "text-teal-600"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Auth/Profile Section */}
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-teal-600 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                      <User className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Stethoscope className="w-5 h-5 text-slate-600" />
            <span className="font-extrabold text-slate-800 tracking-tight">DrNow</span>
          </div>
          <div className="text-center md:text-right text-sm font-medium text-slate-500">
            <p>© {new Date().getFullYear()} DrNow. All rights reserved.</p>
            <p className="mt-1">
              Providing trusted care to patients and support to doctors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;