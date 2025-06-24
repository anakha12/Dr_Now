import { useState } from "react";
import { sendResetOtp, verifyResetOtp } from "../../services/userService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await sendResetOtp(email);
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await verifyResetOtp({ email, otp, newPassword });
      toast.success("Password reset successful");
      navigate("/user/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
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
