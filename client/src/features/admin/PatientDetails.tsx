import { motion } from "framer-motion";
import { User as UserIcon, Phone, Calendar, MapPin, Droplet } from "lucide-react";
import type { AdminUser } from "../../types/userProfile";

interface PatientDetailsProps {
  user: AdminUser;
  onClose: () => void;
}

const PatientDetails = ({ user, onClose }: PatientDetailsProps) => {
  return (
    <div className="flex justify-center items-center py-10">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 space-y-8 max-w-3xl w-full border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={user.image || "/default-avatar.png"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Details Grid */}
        {user.profileCompletion && (
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
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "N/A"}
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
        )}

        {/* Close Button */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetails;
