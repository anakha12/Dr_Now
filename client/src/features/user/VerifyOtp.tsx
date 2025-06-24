import { useState, useEffect } from "react";
import { sendOtp, registerUser } from "../../services/userService";
import { useNavigate, useLocation } from "react-router-dom";
import toast,{Toaster} from "react-hot-toast";
const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      toast.success(res.message);
      setTimer(60);
      setIsCountingDown(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
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
      toast.success("Verified successfully. You can now log in.");
      setTimeout(() => navigate("/user/login"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP Verification failed");
    }
  };

  // Timer countdown (useEffect instead of useState)
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
    return <p className="text-center mt-20">Invalid access. Please register again.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Verify OTP</h2>

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
          Verify
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
            Resend OTP
          </button>
        )}

        
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default VerifyOtp;
