
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { ZodError } from "zod";
import toast, { Toaster } from "react-hot-toast";
import type { LoginFormProps } from "../types/loginFormProps";
import { Messages } from "../constants/messages";

const LoginForm: React.FC<LoginFormProps> = ({
  title,
  subTitle,
  schema,
  loginService,
  setAuth,
  redirectPath,
  placeholders = { email: "Email", password: "Password" },
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      schema.parse({ email, password });

      const res = await loginService(email, password);
      toast.success( Messages.AUTH.LOGIN_SUCCESS);

      dispatch(setAuth({ isAuthenticated: true, user: res.user }));

      setTimeout(() => navigate(redirectPath), 1200);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => toast.error(issue.message));
      } else if (err instanceof Error) {
        toast.error(err.message || Messages.AUTH.LOGIN_FAILED);
      } else {
        toast.error(Messages.AUTH.LOGIN_FAILED);
      }
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaStethoscope className="text-teal-600 text-3xl" />
            <span className="text-3xl font-bold text-teal-700">DrNow</span>
          </div>
          <p className="text-sm text-gray-500">{subTitle}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {title}
        </h2>

        <input
          type="email"
          placeholder={placeholders.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 placeholder-gray-500"
          required
        />
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholders.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LoginForm;
