import { useEffect, useState } from "react";
import { sendOtp, registerUser, googleLogin } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import { FaStethoscope } from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";
import { Messages, NotificationDefaults } from "../../constants/messages";
import { ZodError } from "zod";
import { userRegisterSchema } from "../../validation/userSchema"; 
import logger from "../../utils/logger";

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
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();
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

      addNotification(Messages.DOCTOR.REGISTRATION.REGISTRATION_SUCCESS || NotificationDefaults.SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/user/login"), 1500);
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
      addNotification(Messages.DOCTOR.REGISTRATION.OTP_SENT, "SUCCESS");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-4">
      <div className="hidden md:flex w-1/2 h-full items-center justify-center">
        <img
          src="/img/photo-1622253692010-333f2da6031d.avif"
          alt="Signup Illustration"
          className="max-w-[60%] h-auto rounded-2xl shadow-2xl border-4 border-white transform transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div
          className={`w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-100 transition duration-700 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">DrNow</span>
            </div>
            <p className="text-sm text-gray-500">Your Health, Our Mission</p>
          </div>

          <h2 className="text-xl font-semibold mb-5 text-center text-gray-800">
            {Messages.USER.REGISTRATION.HEADER}
          </h2>

          {step === "form" ? (
            <>
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 mb-3 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 text-sm"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full p-3 mb-3 border ${
                  password !== confirmPassword && confirmPassword.length > 0
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-teal-500 outline-none rounded-xl bg-teal-50 text-sm`}
              />

              <div className="flex items-center mb-4">
                <input
                  id="donner"
                  type="checkbox"
                  checked={isDonner}
                  onChange={() => setIsDonner(!isDonner)}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="donner" className="ml-2 text-gray-700 text-sm select-none">
                  Are you ready to be a donor?
                </label>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full py-3 font-semibold rounded-xl shadow-lg text-sm bg-teal-600 hover:bg-teal-700 text-white transition hover:scale-105"
              >
                {Messages.DOCTOR.REGISTRATION.SEND_OTP}
              </button>
            </>
          ) : (
            <>
              {isCountingDown ? (
                <p className="mb-3 text-xs text-gray-600 text-center">
                  Resend OTP in <span className="font-semibold">{timer}</span> seconds
                </p>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="mb-3 text-teal-600 hover:underline text-xs block mx-auto"
                >
                  {Messages.DOCTOR.REGISTRATION.SEND_OTP}
                </button>
              )}
              <input
                type="text"
                placeholder={Messages.DOCTOR.REGISTRATION.ENTER_OTP}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 focus:border-teal-500 outline-none rounded-xl bg-teal-50 text-sm"
              />
              <button
                onClick={handleRegister}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg text-sm transition hover:scale-105"
              >
                {Messages.DOCTOR.REGISTRATION.VERIFY_REGISTER}
              </button>
            </>
          )}

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-xs select-none">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full py-3 text-teal-700 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 488 512">
              <path d="M488 261.8c0-17.4-1.5-34.2-4.3-50.5H249v95.5h135.6c-5.8 31.3-23.5 57.8-50 75.6v62h80.9c47.3-43.7 74.5-107.8 74.5-182.6zM249 492c67.5 0 124.3-22.3 165.7-60.5l-79.7-62c-22.2 15-50.7 23.8-85.9 23.8-65.9 0-121.8-44.5-141.7-104.2h-82.6v65.6C76.9 440.7 157 492 249 492zM107.3 296.1c-4.7-14.1-7.4-29.1-7.4-44.1s2.7-30 7.4-44.1V142H24.7C9.4 178.1 0 217.4 0 258.2c0 40.8 9.4 80.1 24.7 116.2l82.6-64.3zM249 97.8c35.6 0 67.4 12.3 92.5 36.4l69.3-69.3C374.2 24.8 317.5 0 249 0 157 0 76.9 51.3 49.9 130.4l82.6 65.6c19.9-59.7 75.8-104.2 116.5-104.2z" />
            </svg>
            Sign up with Google
          </button>

          <div className="text-center mt-5 text-xs text-gray-700">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/user/login")}
              className="text-teal-600 hover:underline cursor-pointer"
            >
              Login here
            </span>
            <br />
            Want to be a doctor?{" "}
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
