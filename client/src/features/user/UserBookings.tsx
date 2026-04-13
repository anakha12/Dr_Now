import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { cancelUserBooking, getUserBookings } from "../../services/userService";
import { useNotifications } from "../../hooks/useNotifications";
import type { Booking } from "../../types/booking";
import { Messages } from "../../constants/messages";
import logger from "../../utils/logger";
import { connectSocket, socket } from "../../services/socket";
import { FaCalendarAlt, FaClock, FaUserMd, FaStethoscope, FaFilter, FaChevronLeft, FaChevronRight, FaCommentDots, FaEye, FaTimes, FaReceipt, FaStar } from "react-icons/fa";
import ReviewForm from "./ReviewForm";

const ITEMS_PER_PAGE = 4;

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [doctorFilter, setDoctorFilter] = useState<string>("");
  const [specializationFilter, setSpecializationFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { addNotification, confirmMessage, promptInput } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
  }, []);

  const fetchBookings = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await getUserBookings(page, ITEMS_PER_PAGE, {
        status: statusFilter,
        date: dateFilter,
        doctorName: doctorFilter,
        specialization: specializationFilter,
      });
      setBookings(res.bookings);
      setTotalPages(res.totalPages);
    } catch (error) {
      addNotification(Messages.DOCTOR.APPOINTMENTS.FETCH_FAILED, "ERROR");
      logger.error(error)
    } finally {
      setLoading(false);
    }
    },[
    statusFilter,
    dateFilter,
    doctorFilter,
    specializationFilter,
    addNotification
  ]);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    const confirmed = await confirmMessage(Messages.DOCTOR.APPOINTMENTS.CONFIRM_CANCEL);
    if (!confirmed) return;

    const reason = await promptInput(
      Messages.DOCTOR.APPOINTMENTS.PROMPT_CANCEL_REASON,
      Messages.DOCTOR.APPOINTMENTS.PROMPT_CANCEL_PLACEHOLDER
    );

    if (!reason || reason.trim() === "") {
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_REASON_REQUIRED, "WARNING");
      return;
    }

    try {
       await cancelUserBooking(bookingId, reason);
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_SUCCESS, "SUCCESS");
      fetchBookings(currentPage);
    } catch (err) {
      addNotification(Messages.DOCTOR.APPOINTMENTS.CANCEL_FAILED, "ERROR");
      logger.error(err)
    }
  };

  const handleStartChat = (bookingId: string, doctorId: string) => {
    socket.emit("startChat", {
      bookingId,
      doctorId,
    });

    navigate(`/chat/${bookingId}`);
  };

  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  const statusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const statusDot = (status: string) => {
    switch (status) {
      case "Cancelled": return "bg-rose-500";
      case "Completed": return "bg-emerald-500";
      default: return "bg-blue-500";
    }
  };

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    doctorName: string;
  }>({
    isOpen: false,
    bookingId: "",
    doctorName: "",
  });

  const handleOpenReview = (bookingId: string, doctorName: string) => {
    setReviewModal({
      isOpen: true,
      bookingId,
      doctorName,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pb-20">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-200/40 blur-3xl opacity-60"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-200/40 blur-3xl opacity-50"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-16 mt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Bookings</h1>
            <p className="text-slate-600 font-medium">Manage and view your consultation history.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold shadow-sm transition-all border ${showFilters ? 'bg-teal-600 text-white border-teal-600 shadow-teal-500/30' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'}`}
          >
            <FaFilter /> {showFilters ? "Hide Filters" : "Filters"}
          </motion.button>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 40 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none transition-all"
                      >
                        <option value="">All Statuses</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Smith"
                      value={doctorFilter}
                      onChange={(e) => setDoctorFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiology"
                      value={specializationFilter}
                      onChange={(e) => setSpecializationFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full"
            />
            <p className="mt-4 text-slate-500 font-medium">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] border border-slate-200 border-dashed p-16 text-center max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings found</h3>
            <p className="text-slate-500">You don't have any appointments matching the current filters.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={fadeInUp}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-teal-100 transition-colors"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 overflow-hidden shrink-0">
                      {/* Placeholder for doctor image if you add it later, fallback to icon */}
                       <FaUserMd className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Dr. {booking.doctorName}</h2>
                      <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                        <FaStethoscope className="text-teal-500" /> {booking.department}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border ${statusColor(booking.status || "Pending")} text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(booking.status || "Pending")}`}></span>
                    {booking.status || Messages.DOCTOR.BOOKING_DETAILS.PENDING}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
                        <p className="font-semibold text-slate-800">
                          {booking.date ? new Date(booking.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FaClock />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
                        <p className="font-semibold text-slate-800">{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <FaReceipt />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Amount Paid</p>
                        <p className="font-semibold text-slate-800">₹{booking.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                         <span className="font-black text-sm text-slate-400">#</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Booking ID</p>
                        <p className="font-semibold text-slate-800 truncate max-w-[120px]" title={booking.id}>{booking.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                    >
                      <FaEye /> View Details
                    </button>

                    {booking.status !== "Cancelled" && (
                      <button
                        onClick={() => handleStartChat(booking.id, booking.doctorId)}
                        className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaCommentDots /> Chat
                      </button>
                    )}

                    {booking.status === "Completed" && !booking.isReviewed && (
                      <button
                        onClick={() => handleOpenReview(booking.id, booking.doctorName || "")}
                        className="px-5 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaStar /> Rate Consultation
                      </button>
                    )}

                    {booking.status !== "Cancelled" && booking.status !== "Completed" && booking.canCancel && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm ml-auto"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-12 gap-4"
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:text-teal-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm"
            >
              <FaChevronLeft />
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm font-medium text-slate-600">
              Page <span className="font-bold text-teal-600 mx-1">{currentPage}</span> of {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 hover:text-teal-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm"
            >
              <FaChevronRight />
            </button>
          </motion.div>
        )}
      </div>

      <ReviewForm
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        bookingId={reviewModal.bookingId}
        doctorName={reviewModal.doctorName}
        onSuccess={() => fetchBookings(currentPage)}
      />
    </div>
  );
};

export default UserBookings;
