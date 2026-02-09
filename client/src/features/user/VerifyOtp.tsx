import { useState, useEffect } from "react";
import { sendOtp, registerUser } from "../../services/userService";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { handleError } from "../../utils/errorHandler";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();
  const { email, password, name, isDonner } = location.state || {};

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isCountingDown, setIsCountingDown] = useState(true);

  const handleResendOtp = async () => {
    try {
      const res = await sendOtp({
        email,
        name,
        password,
        isDonner: isDonner ? "true" : "false",
      });
      addNotification(res.message || Messages.DOCTOR.REGISTRATION.OTP_SENT, "SUCCESS");
      setTimer(60);
      setIsCountingDown(true);
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.REGISTRATION.OTP_FAILED);
      addNotification(err.message, "ERROR");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await registerUser({
        email,
        password,
        name,
        otp,
        isDonner: isDonner ? "true" : "false",
      });
      addNotification(Messages.DOCTOR.REGISTRATION.REGISTRATION_SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/user/login"), 1500);
    } catch (error: unknown) {
        const err = handleError(error, Messages.DOCTOR.REGISTRATION.INVALID_OTP);
        addNotification(err.message, "ERROR");
      }
  };

  useEffect(() => {
    if (!isCountingDown) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsCountingDown(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isCountingDown]);

  if (!email || !password || !name) {
    return <p className="text-center mt-20">{Messages.AUTH.LOGIN_FAILED}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          {Messages.DOCTOR.REGISTRATION.VERIFY_REGISTER}
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-4 mb-4 border rounded-xl bg-blue-50"
        />

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold"
        >
          {Messages.COMMON.SUBMIT}
        </button>

        {isCountingDown ? (
          <p className="text-sm text-center mt-4 text-gray-600">
            Resend OTP in <span className="font-semibold">{timer}</span> seconds
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-sm mt-4 text-blue-600 hover:underline block mx-auto"
          >
            {Messages.DOCTOR.REGISTRATION.SEND_OTP}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
