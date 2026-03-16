import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Home, ArrowLeft } from "lucide-react";
import medicalBg from "../assets/not-found.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 selection:bg-teal-100">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group"
      >
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-bl-full -z-10 opacity-60 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-50 rounded-tr-full -z-10 opacity-60 group-hover:scale-110 transition-transform duration-700"></div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-2 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100 z-10"
        >
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Dr<span className="text-teal-600">Now</span>
          </span>
        </motion.div>

        {/* Image Container */}
        <div className="relative w-full max-w-xs -mt-4 -mb-8 z-0">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            src={medicalBg}
            alt="Page Not Found"
            className="w-full object-contain saturate-150 mix-blend-multiply scale-110"
          />
        </div>

        {/* Text Area */}
        <div className="space-y-3 mb-8 max-w-sm mx-auto z-10 relative">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-extrabold text-slate-900 tracking-tight"
          >
            Oops! This page is under treatment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 font-medium leading-relaxed text-sm"
          >
            The page you're looking for might have been moved, removed, or is temporarily unavailable right now.
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-teal-200 hover:bg-teal-50 text-slate-700 font-bold rounded-xl transition-all shadow-sm group/btn"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover/btn:text-teal-600 group-hover/btn:-translate-x-1 transition-all" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 group/btn"
          >
            <Home className="w-4 h-4 text-teal-100 group-hover/btn:scale-110 transition-transform" />
            Back to Home
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default NotFound;