import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaEye, FaEyeSlash, FaHeart, FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { ZodError } from "zod";
import toast, { Toaster } from "react-hot-toast";
import type { LoginFormProps } from "../types/loginFormProps";
import { Messages } from "../constants/messages";
import type { AppDispatch } from "../redux/store";
import medicalBg from "../assets/unnamed.jpg";
import { FcGoogle } from "react-icons/fc";

const LoginForm = <TUser,>({
  title,
  subTitle,
  schema,
  loginService,
  setAuth,
  redirectPath,
  registerPath, 
  registerText = "Don't have an account? Register here",
  placeholders = { email: "Email", password: "Password" },
  googleLogin,
  showGoogleLogin = false,
}: LoginFormProps<TUser>) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      schema.parse({ email, password });
      const res = await loginService(email, password);
      dispatch(setAuth({ isAuthenticated: true, user: res.user }));
      toast.success(Messages.AUTH.LOGIN_SUCCESS);
      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => toast.error(issue.message));
      } else if (err instanceof Error) {
        toast.error(err.message || Messages.AUTH.LOGIN_FAILED);
      } else {
        toast.error(Messages.AUTH.LOGIN_FAILED);
      }
    }
  };

return (
  <div className="h-screen flex items-center justify-center bg-gray-100 px-4">

    {/* OUTER CARD */}
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2">
        <img
          src={medicalBg}
          alt="Medical"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <FaStethoscope className="text-teal-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">
              Dr<span className="text-teal-600">Now</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">{subTitle}</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {title}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                placeholder={placeholders.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholders.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
          >
            Sign In
          </button>
          {/* Google Login */}
          {showGoogleLogin && (
            <>
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-3 text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <button
                type="button"
                onClick={googleLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <FcGoogle className="text-lg" />
                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>
            </>
          )}
        </form>

        {/* Register */}
        {registerPath && (
          <div className="mt-5 text-sm text-gray-600">
            <button
              type="button"
              onClick={() => navigate(registerPath)}
              className="text-teal-600 hover:underline"
            >
              {registerText}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400 flex items-center gap-1">
          <FaHeart className="text-teal-500 text-[10px]" />
          Trusted by thousands of patients
        </div>

      </div>
    </div>

    <Toaster position="top-center" reverseOrder={false} />
  </div>
);
};

export default LoginForm;
