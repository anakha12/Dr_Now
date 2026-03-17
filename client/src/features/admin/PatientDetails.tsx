import { motion } from "framer-motion";
import { User as UserIcon, Phone, Calendar, MapPin, Droplet, X } from "lucide-react";
import type { AdminUser } from "../../types/userProfile";

interface PatientDetailsProps {
  user: AdminUser;
  onClose: () => void;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
    <div className="p-2 bg-white rounded-md shadow-sm border border-slate-200 text-teal-600 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-semibold text-slate-800 text-sm">{value}</p>
    </div>
  </div>
);

const PatientDetails = ({ user, onClose }: PatientDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-sans">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col border border-slate-200"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header (Sticky) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-800">Patient Profile</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Profile Image & Status*/}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="w-24 h-24 rounded-xl border border-slate-200 shadow-sm object-cover"
              />
              <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-lg border bg-white shadow-sm ${user.isBlocked ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
                {user.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 font-medium text-sm">{user.email}</p>
              {!user.profileCompletion && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  Profile Incomplete
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          {user.profileCompletion && (
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem icon={Phone} label="Phone Number" value={user.phone || "N/A"} />
                <InfoItem icon={Calendar} label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"} />
                <InfoItem icon={UserIcon} label="Age" value={user.age || "N/A"} />
                <InfoItem icon={UserIcon} label="Gender" value={user.gender || "N/A"} />
                <InfoItem icon={Droplet} label="Blood Group" value={user.bloodGroup || "N/A"} />
                <InfoItem icon={MapPin} label="Address" value={user.address || "N/A"} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white font-medium text-sm rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientDetails;
