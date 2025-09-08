import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import toast, { Toaster } from "react-hot-toast";
import { FaStethoscope } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../redux/slices/authSlice";


const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      dispatch(setUserAuth({isAuthenticated: true, user:res.user}))
      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/user/dashboard") ;
      }, 1200);

    } catch (err: any) {
      if (err.isVerificationRequired) {
        navigate("/user/verify-otp", {
          state: {
            email: err.email,
            password: err.password,
            name: "",
            isDonner: "",
          },
        });
        return;
      }
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">

          {/* ---- Brand Header ---- */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">MedConsult</span>
            </div>
            <p className="text-sm text-gray-500">Your Health, Our Mission</p>
          </div>

          {/* ---- Login Heading ---- */}
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Login to Your Account
          </h2>

          {/* ---- Input Fields ---- */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 placeholder-gray-500"
          />
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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


          {/* ---- Login Button ---- */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Login
          </button>

          {/* ---- Links ---- */}
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
            Forgot Password?
          </p>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default UserLogin;
