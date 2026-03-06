import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { getUserProfile } from "../../services/userService";
import type { User } from "../../types/user";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Phone, Edit3, Calendar, MapPin, Droplet, Mail } from "lucide-react";
import logger from "../../utils/logger";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        addNotification(Messages.USER.FETCH_FAILED, "ERROR");
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [addNotification]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
           className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full"
        />
        <p className="mt-4 text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
         <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <UserIcon className="w-10 h-10 text-rose-300" />
         </div>
         <p className="text-xl font-bold text-slate-800">{Messages.USER.FETCH_FAILED}</p>
      </div>
    );
  }

  const isProfileComplete = Boolean(
    user.phone &&
    user.dateOfBirth &&
    user.age &&
    user.gender &&
    user.bloodGroup &&
    user.address &&
    user.image
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 md:p-10 max-w-5xl mx-auto w-full"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My Profile</h1>
          <p className="text-slate-500 font-medium">View and manage your personal details and health information.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/user/update-profile")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all border border-teal-500"
        >
          <Edit3 className="w-5 h-5" />
          {isProfileComplete ? "Update Profile" : "Complete Profile"}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
           <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group">
             {/* Decorative blob inside card */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

             <div className="relative mb-6">
                <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20">
                  <img
                    src={user.image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                </div>
                {!isProfileComplete && (
                   <div className="absolute top-2 right-2 w-5 h-5 bg-rose-500 border-2 border-white rounded-full" title="Incomplete Profile"></div>
                )}
             </div>

             <h2 className="text-2xl font-extrabold text-slate-800 mb-1">{user.name}</h2>
             
             <div className="flex items-center gap-2 text-slate-500 font-medium mt-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
               <Mail className="w-4 h-4 text-slate-400" />
               <span className="text-sm">{user.email}</span>
             </div>

             {/* Profile Completion Indicator */}
             <div className="w-full mt-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  <span>Profile Completion</span>
                  <span className={isProfileComplete ? "text-emerald-600" : "text-amber-500"}>
                    {isProfileComplete ? "100%" : "Requires Action"}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full rounded-full ${isProfileComplete ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-2/3'}`}></div>
                </div>
             </div>
           </div>
        </motion.div>

        {/* Right Column - Details Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {[
            { label: "Phone Number", value: user.phone, icon: Phone, color: "blue" },
            { label: "Date of Birth", value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : null, icon: Calendar, color: "indigo" },
            { label: "Age", value: user.age ? `${user.age} Years` : null, icon: UserIcon, color: "purple" },
            { label: "Gender", value: user.gender, icon: UserIcon, color: "rose" },
            { label: "Blood Group", value: user.bloodGroup, icon: Droplet, color: "red" },
            { label: "Address", value: user.address, icon: MapPin, color: "orange" },
          ].map((item, idx) => {
             const Icon = item.icon;
             const isMissing = !item.value;

             // Map generic color to specific tailwind classes
             const colorClasses: Record<string, { bg: string, text: string }> = {
                blue: { bg: "bg-blue-50", text: "text-blue-600" },
                indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
                purple: { bg: "bg-purple-50", text: "text-purple-600" },
                rose: { bg: "bg-rose-50", text: "text-rose-600" },
                red: { bg: "bg-red-50", text: "text-red-500" },
                orange: { bg: "bg-orange-50", text: "text-orange-600" },
             };
             const theme = colorClasses[item.color] || colorClasses.blue;

             return (
               <motion.div
                 key={idx}
                 variants={fadeInUp}
                 className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/40 p-6 flex flex-col h-full hover:border-teal-100 transition-colors group"
               >
                  <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    {isMissing ? (
                       <p className="text-slate-400 italic font-medium flex items-center gap-2">
                         Not provided
                       </p>
                    ) : (
                       <p className="text-lg font-bold text-slate-800 break-words">{item.value}</p>
                    )}
                  </div>
               </motion.div>
             )
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
