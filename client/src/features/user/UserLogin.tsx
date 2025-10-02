import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../redux/slices/authSlice";
import { loginUser } from "../../services/userService";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { userLoginSchema } from "../../validation/userSchema"; 
import { ZodError } from "zod";  

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNotification } = useNotifications();

  const handleLogin = async () => {
    try {
      userLoginSchema.parse({ email, password });

      const res = await loginUser(email, password);
      dispatch(setUserAuth({ isAuthenticated: true, user: res.user }));
      addNotification(Messages.AUTH.LOGIN_SUCCESS, "SUCCESS");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1200);

    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          addNotification(issue.message, "ERROR");
        });
        return;
      }

      if ((err as any).isVerificationRequired) {
        navigate("/user/verify-otp", {
          state: {
            email: (err as any).email,
            password: (err as any).password,
            name: "",
            isDonner: "",
          },
        });
        return;
      }
      addNotification((err as any).message || Messages.AUTH.LOGIN_FAILED, "ERROR");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">

          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">DrNow</span>
            </div>
            <p className="text-sm text-gray-500">Your Health, Our Mission</p>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Login to Your Account
          </h2>

          {/* Input Fields */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 placeholder-gray-500"
          />
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 placeholder-gray-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Login
          </button>

          {/* Links */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <span
              className="text-teal-600 hover:underline cursor-pointer"
              onClick={() => navigate("/user/register")}
            >
              Register
            </span>
          </p>
          <p
            className="mt-3 text-center text-teal-600 hover:underline cursor-pointer text-sm"
            onClick={() => navigate("/user/forgot-password")}
          >
            {Messages.FORGOT_PASSWORD.ENTER_EMAIL || "Forgot Password?"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
