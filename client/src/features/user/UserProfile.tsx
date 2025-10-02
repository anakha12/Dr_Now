import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUserProfile } from "../../services/userService";
import type { User } from "../../types/user";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { useNavigate } from "react-router-dom";
import { User as UserIcon,  Phone, Edit3, Calendar, MapPin, Droplet } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        console.log(data)
        setUser(data);
      } catch (err) {
        addNotification(Messages.USER.FETCH_FAILED, "ERROR");
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-gray-500">{Messages.USER.FETCH_FAILED}</p>;
  }


  const isProfileComplete =
    user.phone &&
    user.dateOfBirth &&
    user.age &&
    user.gender &&
    user.bloodGroup &&
    user.address &&
    user.image;

  return (
    <div className="p-6 flex flex-col items-center">
      <motion.h1
        className="text-4xl font-extrabold mb-10 text-teal-700 tracking-tight"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Profile Overview
      </motion.h1>

      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 space-y-8 max-w-3xl w-full border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="flex items-center space-x-3">
            <Phone className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{user.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold">
                {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserIcon className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-semibold">{user.age || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserIcon className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{user.gender || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Droplet className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Blood Group</p>
              <p className="font-semibold">{user.bloodGroup || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold">{user.address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => navigate("/user/update-profile")}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl shadow-md hover:bg-teal-700 transition"
          >
            <Edit3 className="w-5 h-5" />
            {isProfileComplete ? "Update Profile" : "Complete Profile"}
          </button>
        </div>
      </motion.div>

    </div>
  );
};

export default UserProfile;
