import {
  FaUserEdit,
  FaCalendarCheck,
  FaFilePrescription,
  FaComments,
  FaHandHoldingUsd,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Outlet, useNavigate, Link } from "react-router-dom"; // <-- use Link
import { userLogout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const navItems = [
  { to: "profile", icon: <FaUserEdit />, label: "Update Profile" },
  { to: "bookings", icon: <FaCalendarCheck />, label: "See Bookings" },
  { to: "prescriptions", icon: <FaFilePrescription />, label: "Prescriptions" },
  { to: "chat", icon: <FaComments />, label: "Chat" },
  { to: "fund-request", icon: <FaHandHoldingUsd />, label: "Fund Request" },
  { to: "wallet", icon: <FaHandHoldingUsd />, label: "Wallet" },
];

const ProfileLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(userLogout());
    navigate("/user/login");
  };

  return (
    <motion.div
      className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 space-y-6 rounded-tr-3xl rounded-br-3xl">
        <motion.div
          className="text-lg font-semibold text-teal-700"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          User Menu
        </motion.div>

        <nav className="space-y-4 text-sm">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link
                to={item.to} // <-- Link instead of href
                className="flex items-center gap-3 p-2 rounded-md transition-all hover:bg-teal-100 text-gray-700 hover:text-teal-700"
              >
                {item.icon}
                {item.label}
              </Link>
            </motion.div>
          ))}

          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:underline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </motion.div>
  );
};

export default ProfileLayout;
