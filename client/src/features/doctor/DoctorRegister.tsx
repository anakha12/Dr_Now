import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, registerDoctor, getAllDepartments } from "../../services/doctorService";
import { FaStethoscope } from "react-icons/fa";
import type { Department } from "../../types/department"; 
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { ZodError } from "zod";
import { doctorRegisterSchema } from "../../validation/doctorSchema";

const DoctorRegister = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [consultFee, setConsultFee] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [idProof, setIdProof] = useState<File | null>(null);
  const [medicalLicense, setMedicalLicense] = useState<File | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data); 
      } catch {
        addNotification(Messages.DOCTOR.REGISTRATION.DEPARTMENTS_FETCH_FAILED, "ERROR");
      }
    };
    fetchDepartments();
  }, []);

  const validateForm = () => {
    try {
      doctorRegisterSchema.parse({
        name,
        email,
        password,
        age: Number(age),
        phone,
        gender: gender as "Male" | "Female" | "Other",
        yearsOfExperience: Number(yearsOfExperience),
        consultFee: Number(consultFee),
        specialization,
        language,
      });

      if (!profileImage || !idProof || !medicalLicense) {
        addNotification(Messages.DOCTOR.REGISTRATION.FILL_ALL_FIELDS, "ERROR");
        return false;
      }
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        err.issues.forEach(issue => addNotification(issue.message, "ERROR"));
      }
      return false;
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
    return;
  }


    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("language", language);
    formData.append("specialization", specialization);
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("consultFee", consultFee);
    formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);
    if (idProof) formData.append("idProof", idProof);
    if (medicalLicense) formData.append("medicalLicense", medicalLicense);

    try {
      await sendOtp(formData);
      setOtpSent(true);
      addNotification(Messages.DOCTOR.REGISTRATION.OTP_SENT, "SUCCESS");
    } catch {
      addNotification(Messages.DOCTOR.REGISTRATION.OTP_FAILED, "ERROR");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      addNotification(Messages.DOCTOR.REGISTRATION.INVALID_OTP, "ERROR");
      return;
    }

    try {
      const response = await registerDoctor(email, otp);
      const doctorId = (response as any).doctorId;

      // Store required values for profile completion
      localStorage.setItem("doctorId", doctorId);
      localStorage.setItem("doctorName", name);
      localStorage.setItem("doctorGender", gender);
      localStorage.setItem("doctorSpecialization", specialization);
      localStorage.setItem("doctorConsultFee", consultFee);

      addNotification(Messages.DOCTOR.REGISTRATION.REGISTRATION_SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/doctor/profile-complete"), 1500);
    } catch {
      addNotification(Messages.DOCTOR.REGISTRATION.INVALID_OTP, "ERROR");
    }
  };

return (
  <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 px-4">

    {/* OUTER CARD */}
    <div className="w-full max-w-6xl h-[95vh] bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2">
        <img
          src="/img/photo-1622253692010-333f2da6031d.avif"
          alt="Doctor"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 p-8">

        {/* Logo */}
        <div className="text-center mb-5">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FaStethoscope className="text-emerald-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">
              Dr<span className="text-emerald-600">Now</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">Doctor Portal</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-5 text-center">
          {otpSent
            ? Messages.DOCTOR.REGISTRATION.ENTER_OTP
            : Messages.DOCTOR.REGISTRATION.HEADER}
        </h2>

        <form
          onSubmit={otpSent ? handleRegister : handleSendOtp}
          encType="multipart/form-data"
        >
          {!otpSent ? (
            <>
              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="input-field"
                  required
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input-field"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />

                <input
                  type="text"
                  placeholder="Language(s)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                  required
                />

                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Specialization</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.Departmentname}>
                      {dept.Departmentname}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Experience (Years)"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="input-field"
                  required
                />

                <input
                  type="number"
                  placeholder="Consult Fee"
                  value={consultFee}
                  onChange={(e) => setConsultFee(e.target.value)}
                  className="input-field"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field sm:col-span-2"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field sm:col-span-2"
                  required
                />
              </div>

              {/* FILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setProfileImage)}
                  className="file-field"
                  required
                />

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setIdProof)}
                  className="file-field"
                  required
                />

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, setMedicalLicense)}
                  className="file-field sm:col-span-2"
                  required
                />
              </div>
            </>
          ) : (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="input-field mb-5"
              required
            />
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all duration-300"
          >
            {otpSent
              ? Messages.DOCTOR.REGISTRATION.VERIFY_REGISTER
              : Messages.DOCTOR.REGISTRATION.SEND_OTP}
          </button>
          {/* Go Back to Login */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/doctor/login")}
              className="text-sm text-emerald-700 hover:text-emerald-800 hover:underline transition"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* COMMON INPUT STYLE */}
    <style>
      {`
        .input-field {
          width: 100%;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          background: rgba(16, 185, 129, 0.08);
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          background: rgba(16, 185, 129, 0.12);
        }
        .file-field {
          font-size: 13px;
        }
      `}
    </style>
  </div>
);
};

export default DoctorRegister;
