import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { updateUserProfile, getUserProfile } from "../../services/userService"; 
import type { UserProfile } from "../../types/userProfile";
import { z } from "zod";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/errorHandler"; 
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  User as UserIcon, 
  Phone, 
  Calendar, 
  MapPin, 
  Droplet, 
  Mail, 
  Upload, 
  Save, 
  ArrowLeft 
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string().optional(),
  address: z.string().min(5, "Address too short"),
  age: z.coerce.number().min(1, "Age must be positive").optional(),
  image: z.string().optional(),
});

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const UpdateProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserProfile()
      .then((data) => setFormData(data))
      .catch((err) => console.error(Messages.USER.UPDATE_FAILED, err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev!, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      addNotification("Please fix the errors in the form.", "WARNING");
      return;
    }
    setErrors({});
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, value.toString());
      });
      if (selectedFile) data.append("file", selectedFile);
      
      await updateUserProfile(data);
      addNotification(Messages.USER.PROFILE_UPDATE_SUCCESS, "SUCCESS");
      navigate("/user/profile");

    } catch (error: unknown) {
      const err = handleError(error, Messages.USER.UPDATE_FAILED);
      addNotification(err.message, "ERROR");  
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
           className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full mb-4"
        />
        <p className="text-slate-500 font-medium">Loading form data...</p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
         <p className="text-xl font-bold text-slate-800">Failed to load profile data.</p>
         <button onClick={() => navigate("/user/profile")} className="mt-4 text-teal-600 hover:underline">
           Return to Profile
         </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 md:p-10 max-w-4xl mx-auto w-full"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <button 
            onClick={() => navigate("/user/profile")}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
        </div>
      </motion.div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-10">
          
          {/* Top Section: Avatar Upload & Primary Info */}
          <div className="flex flex-col md:flex-row gap-10 mb-10 pb-10 border-b border-slate-100">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl shadow-teal-500/20">
                  <img
                    src={preview || formData.image || "/default-avatar.png"}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover border-4 border-white bg-white"
                  />
                </div>
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-slate-900/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer m-1.5">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Change</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mt-2">
                Profile Photo<br />
                <span className="text-[10px] font-medium text-slate-400 normal-case tracking-normal">Max size: 5MB</span>
              </p>
            </div>

            {/* Primary Details */}
            <div className="flex-1 grid grid-cols-1 gap-6 content-center">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            {/* Phone */}
            <motion.div variants={fadeInUp}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.phone}</p>}
            </motion.div>

            {/* Date of Birth & Age Container */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.dateOfBirth ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all appearance-none`}
                  />
                </div>
                {errors.dateOfBirth && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.age ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal`}
                  placeholder="e.g. 28"
                />
                {errors.age && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.age}</p>}
              </div>
            </motion.div>

            {/* Gender */}
            <motion.div variants={fadeInUp}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className={`w-full pl-4 pr-10 py-3 bg-slate-50 border ${errors.gender ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all appearance-none`}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.gender && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.gender}</p>}
            </motion.div>

            {/* Blood Group */}
            <motion.div variants={fadeInUp}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Blood Group
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Droplet className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="e.g. O+"
                />
              </div>
            </motion.div>

            {/* Address */}
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Residential Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${errors.address ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-teal-500'} rounded-xl text-slate-700 font-semibold focus:ring-2 focus:border-transparent outline-none transition-all placeholder:text-slate-400 placeholder:font-normal resize-none`}
                  placeholder="Enter your full residential address"
                />
              </div>
              {errors.address && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.address}</p>}
            </motion.div>

          </motion.div>

          {/* Action Footer */}
          <motion.div 
            variants={fadeInUp}
            className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:text-teal-600 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all border border-teal-500 flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </motion.div>

        </form>
      </div>
    </motion.div>
  );
};

export default UpdateProfile;
