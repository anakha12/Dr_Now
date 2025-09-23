import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserProfile } from "../../services/userService";
import type { User } from "../../types/user";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        addNotification(Messages.USER.FETCH_FAILED, "ERROR");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <motion.h1
        className="text-3xl font-extrabold mb-8 text-teal-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Profile Overview
      </motion.h1>

      {user ? (
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="text-gray-600 text-sm">Full Name</label>
            <p className="text-lg font-semibold">{user.name || Messages.USER.NO_RESULTS}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <p className="text-lg font-semibold">{user.email || Messages.USER.NO_RESULTS}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Phone</label>
            <p className="text-lg font-semibold">{user.phone || "N/A"}</p>
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-500">{Messages.USER.FETCH_FAILED}</p>
      )}
    </div>
  );
};

export default UserProfile;
