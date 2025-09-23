import { useState } from "react";
import { adminLogin } from "../../services/adminService";
import toast, { Toaster } from "react-hot-toast";
import { FaStethoscope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAdminAuth } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../constants/routes";
import { Messages } from "../../constants/messages";
import { adminLoginSchema } from "../../validation/adminSchema";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    
      adminLoginSchema.parse({ email, password });

      const res = await adminLogin(email, password);
      toast.success(Messages.AUTH.LOGIN_SUCCESS);
      dispatch(setAdminAuth({ isAuthenticated: true, user: res.user }));
      setTimeout(() => {
        navigate(AdminRoutes.DASHBOARD);
      }, 1200);
    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((e: any) => toast.error(e.message));
        return;
      }

      if (err.message === "Not an admin") {
        toast.error(Messages.AUTH.LOGIN_ACCESS_DENIED);
      } else {
        toast.error(Messages.AUTH.LOGIN_FAILED);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-4">
      <div className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaStethoscope className="text-teal-600 text-3xl" />
            <span className="text-3xl font-bold text-teal-700">DrNow</span>
          </div>
          <p className="text-sm text-gray-500">Admin Panel Login</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 placeholder-gray-500"
            required
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

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminLogin;
