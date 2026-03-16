import { useEffect, useState } from "react";
import { sendOtp, registerUser, googleLogin } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import { FaStethoscope } from "react-icons/fa";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages, NotificationDefaults } from "../../constants/messages";
import { ZodError } from "zod";
import { userRegisterSchema } from "../../validation/userSchema";
import logger from "../../utils/logger";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../redux/slices/authSlice";
import { userAxios } from "../../services/axiosInstances";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserRegister = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [isDonner, setIsDonner] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [, setFadeIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNotification } = useNotifications();

  const handleSendOtp = async () => {
    try {
      userRegisterSchema.parse({ name, email, password, confirmPassword, isDonner });

      const res = await sendOtp({
        name,
        email,
        password,
        isDonner: isDonner ? "true" : "false",
      });

      addNotification(res.message || NotificationDefaults.SUCCESS, "SUCCESS");
      setStep("otp");
      setTimer(60);
      setIsCountingDown(true);
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => addNotification(issue.message, "ERROR"));
        return;
      }
      addNotification((err as Error).message || Messages.USER.FETCH_FAILED, "ERROR");
    }
  };

  const handleRegister = async () => {
    try {
      userRegisterSchema.parse({ name, email, password, confirmPassword, otp, isDonner });

      await registerUser({
        name,
        email,
        password,
        otp,
        isDonner: isDonner ? "true" : "false",
      });

      addNotification(
        Messages.DOCTOR.REGISTRATION.REGISTRATION_SUCCESS ||
          NotificationDefaults.SUCCESS,
        "SUCCESS"
      );

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => addNotification(issue.message, "ERROR"));
        return;
      }
      addNotification((err as Error).message || NotificationDefaults.ERROR, "ERROR");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await googleLogin({
        name: user.displayName || "",
        email: user.email || "",
        uid: user.uid,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      dispatch(setUserAuth({ isAuthenticated: true, user: response.user }));

      userAxios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
      navigate("/user/dashboard");
    } catch (err) {
      addNotification(Messages.DOCTOR.REGISTRATION.OTP_FAILED, "ERROR");
      logger.error(err);
    }
  };

  useEffect(() => setFadeIn(true), []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isCountingDown && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setIsCountingDown(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountingDown, timer]);

return (
  <div className="h-screen flex items-center justify-center bg-gray-100 px-4">

    {/* OUTER CARD */}
    <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2">
        <img
          src="/img/photo-1622253692010-333f2da6031d.avif"
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaStethoscope className="text-teal-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">
              Dr<span className="text-teal-600">Now</span>
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          {Messages.USER.REGISTRATION.HEADER}
        </h2>

        {step === "form" ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />

              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />

              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex items-center mb-5">
              <input
                type="checkbox"
                checked={isDonner}
                onChange={() => setIsDonner(!isDonner)}
                className="h-4 w-4 text-teal-600"
              />
              <label className="ml-2 text-sm text-gray-600">
                Ready to be a donor?
              </label>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
            >
              {Messages.DOCTOR.REGISTRATION.SEND_OTP}
            </button>
          </>
        ) : (
          <>
            {isCountingDown ? (
              <p className="text-sm text-gray-600 text-center mb-3">
                Resend OTP in <span className="font-semibold">{timer}</span>s
              </p>
            ) : (
              <button
                onClick={handleSendOtp}
                className="text-teal-600 text-sm mb-3 hover:underline block mx-auto"
              >
                Resend OTP
              </button>
            )}

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />

            <button
              onClick={handleRegister}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
            >
              {Messages.DOCTOR.REGISTRATION.VERIFY_REGISTER}
            </button>
          </>
        )}

        <div className="flex items-center my-5">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Sign up with Google
        </button>

        <div className="text-center mt-6 text-sm text-gray-600">
          <span
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline cursor-pointer"
          >
            Already have an account? Login
          </span>
          <br />
          <span
            onClick={() => navigate("/doctor/register")}
            className="text-teal-600 hover:underline cursor-pointer"
          >
            Register as Doctor
          </span>
        </div>

      </div>
    </div>
  </div>
);
};

export default UserRegister;