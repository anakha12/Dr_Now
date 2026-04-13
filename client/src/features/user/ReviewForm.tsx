import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import StarRating from "../../components/common/StarRating";
import { reviewApiService } from "../../services/reviewService";
import { rootAxios } from "../../services/axiosInstances";
import { useNotifications } from "../../hooks/useNotifications";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  doctorName: string;
  onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  bookingId,
  doctorName,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addNotification("Please select a rating", "WARNING");
      return;
    }
    if (comment.trim().length < 10) {
      addNotification("Comment must be at least 10 characters long", "WARNING");
      return;
    }

    setLoading(true);
    try {
      await reviewApiService.createReview(
        { bookingId, rating, comment },
        rootAxios
      );
      addNotification("Review submitted successfully!", "SUCCESS");
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to submit review";
      addNotification(message, "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Rate Consultation
                  </h2>
                  <p className="text-slate-500 font-medium">
                    With Dr. {doctorName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Your Rating
                  </p>
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size={40}
                  />
                  <p className="mt-4 text-slate-600 font-bold text-lg">
                    {rating > 0 ? `${rating} / 5 Stars` : "Select stars"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    Your Feedback
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience about the consultation..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-700 font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-3xl shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>Submit Review</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewForm;
