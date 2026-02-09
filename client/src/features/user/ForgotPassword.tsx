import { useState } from "react";
import { sendResetOtp, verifyResetOtp } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import logger from "../../utils/logger";
import { handleError } from "../../utils/errorHandler"; 

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleSendOtp = async () => {
    if (!email) {
      addNotification(Messages.FORGOT_PASSWORD.ENTER_EMAIL, "INFO");
      return;
    }
    try {
      await sendResetOtp(email);
      addNotification(Messages.FORGOT_PASSWORD.OTP_SENT, "SUCCESS");
      setStep("verify");
    } catch (error: unknown) {
      const err = handleError(error, Messages.FORGOT_PASSWORD.OTP_FAILED);
        logger.error(err);
        addNotification(err.message, "ERROR");
      }
  };

  const handleResetPassword = async () => {
    if (!otp) {
      addNotification(Messages.FORGOT_PASSWORD.ENTER_OTP, "INFO");
      return;
    }
    if (!newPassword) {
      addNotification(Messages.FORGOT_PASSWORD.ENTER_NEW_PASSWORD, "INFO");
      return;
    }

    try {
      await verifyResetOtp({ email, otp, newPassword });
      addNotification(Messages.FORGOT_PASSWORD.RESET_SUCCESS, "SUCCESS");
      navigate("/user/login");
    } catch (error: unknown) {
        const err = handleError(error, Messages.FORGOT_PASSWORD.RESET_FAILED);
        logger.error(err);
        addNotification(err.message, "ERROR");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Reset Password</h2>

        {step === "email" ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mb-4 border rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 border rounded-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full p-3 mb-4 border rounded-xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
