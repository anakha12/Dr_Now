import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../redux/slices/authSlice";
import { getUserProfile } from "../../services/userService";
import { Messages, NotificationDefaults } from "../../constants/messages";
import log from "../../utils/logger";
import type { AppointmentData } from "../../types/appointmentData";
import { motion } from "framer-motion";
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUserMd, FaArrowLeft, FaReceipt } from "react-icons/fa";

const Success = () => {
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [searchParams] = useSearchParams();
  const notifiedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!notifiedRef.current) {
        const userId = searchParams.get("userId");
        const doctorName = searchParams.get("doctorName");
        const date = searchParams.get("date");
        const slotFrom = searchParams.get("slotFrom");
        const slotTo = searchParams.get("slotTo");
        const fee = searchParams.get("fee");

        setAppointmentData({ userId, doctorName, date, slotFrom, slotTo, fee });
        setLoading(false);

        // Notify success
        addNotification(Messages.DOCTOR.APPOINTMENTS.BOOKING_SUCCESS, "SUCCESS");
        notifiedRef.current = true;

        try {
          const user = await getUserProfile();
          dispatch(setUserAuth({ isAuthenticated: true, user }));
        } catch (err) {
          log.error(Messages.USER.FETCH_FAILED_USER_AFTER_BOOK, err);
        }
      }
    };

    fetchData();
  }, [searchParams, addNotification, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full z-10"
        />
        <p className="mt-4 text-slate-500 font-medium z-10">{NotificationDefaults.INFO}</p>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2rem] shadow-xl text-center z-10 max-w-md w-full mx-4"
        >
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{Messages.DOCTOR.APPOINTMENTS.NO_BOOKINGS}</h2>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="mt-6 px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex items-center justify-center p-4 sm:p-6 py-12">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/40 blur-3xl opacity-60 max-w-[500px] max-h-[500px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] right-[0%] w-[40vw] h-[40vw] rounded-full bg-emerald-200/40 blur-3xl opacity-50 max-w-[400px] max-h-[400px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-teal-900/5 border border-slate-100 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 pt-10 text-center text-white relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-teal-900/20 text-teal-500"
          >
            <FaCheckCircle className="w-12 h-12" />
          </motion.div>
          <h2 className="text-2xl font-extrabold mb-2 tracking-tight">
            {Messages.DOCTOR.APPOINTMENTS.BOOKING_SUCCESS}
          </h2>
          <p className="text-teal-50 font-medium opacity-90 text-sm">
            Your appointment has been confirmed and scheduled.
          </p>
          
          <div className="absolute bottom-0 left-0 w-full h-4 bg-white rounded-t-[2rem]"></div>
        </div>

        <div className="p-8 pb-10 pt-4">
          <div className="space-y-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-teal-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-sm border border-teal-100/50">
                <FaUserMd className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Doctor</p>
                <p className="text-slate-900 font-bold capitalize">Dr. {appointmentData.doctorName}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-teal-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
                <FaCalendarAlt className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                <p className="text-slate-900 font-bold">{appointmentData.date}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/50">
                <FaClock className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Time</p>
                <p className="text-slate-900 font-bold">{appointmentData.slotFrom} - {appointmentData.slotTo}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200/50 text-slate-600 flex items-center justify-center shrink-0">
                  <FaReceipt className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-600">Amount Paid</span>
              </div>
              <span className="text-lg font-extrabold text-teal-600">₹{appointmentData.fee}</span>
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate("/user/bookings")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>{Messages.DOCTOR.BOOKING_DETAILS.BACK_BUTTON}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
