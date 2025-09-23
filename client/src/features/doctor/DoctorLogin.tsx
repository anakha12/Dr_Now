import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doctorLogin } from "../../services/doctorService";
import toast, { Toaster } from "react-hot-toast";
import { FaStethoscope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setDoctorAuth } from "../../redux/slices/authSlice";
import { z, ZodError } from "zod";
import { Messages } from "../../constants/messages";  
import { doctorLoginSchema } from "../../validation/doctorSchema";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      doctorLoginSchema.parse({ email, password });

      await doctorLogin(email, password);

      toast.success(Messages.AUTH.LOGIN_SUCCESS); 
      dispatch(setDoctorAuth({ isAuthenticated: true}));

      setTimeout(() => navigate("/doctor/dashboard"), 1500);
    } catch (err: any) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => toast.error(issue.message));
      } else {
        toast.error(err?.message || Messages.AUTH.LOGIN_FAILED);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-2 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 sm:p-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 backdrop-blur-lg"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaStethoscope className="text-teal-600 text-3xl" />
            <span className="text-3xl font-bold text-teal-700">DrNow</span>
          </div>
          <p className="text-sm text-gray-500">Doctor Portal</p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {Messages.DOCTOR.LOGIN_HEADING} 
        </h2>

        {/* Inputs */}
        <input
          type="email"
          placeholder={Messages.PLACEHOLDER.EMAIL} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 transition text-sm"
          required
        />
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={Messages.PLACEHOLDER.PASSWORD} 
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg text-sm transition hover:scale-[1.02] active:scale-[0.98]"
        >
          {Messages.DOCTOR.LOGIN_BUTTON} 
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default DoctorLogin;
