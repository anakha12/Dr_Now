import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, registerDoctor, getAllDepartments } from "../../services/doctorService";
import { FaStethoscope } from "react-icons/fa";
import type { Department } from "../../types/department"; 
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { z, ZodError } from "zod";
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

  // File handler
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
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
    if (!validateForm()) return;

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
      localStorage.setItem("doctorId", doctorId);
      addNotification(Messages.DOCTOR.REGISTRATION.REGISTRATION_SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/doctor/profile-complete", { state: { email } }), 1500);
    } catch {
      addNotification(Messages.DOCTOR.REGISTRATION.INVALID_OTP, "ERROR");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-2 py-8">
      <div className="relative w-full max-w-2xl">
        <form
          onSubmit={otpSent ? handleRegister : handleSendOtp}
          className="w-full p-6 sm:p-10 bg-white/90 rounded-[2.5rem] shadow-2xl border border-gray-200 backdrop-blur-lg"
          encType="multipart/form-data"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">DrNow</span>
            </div>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {otpSent ? Messages.DOCTOR.REGISTRATION.ENTER_OTP : Messages.DOCTOR.REGISTRATION.HEADER}
          </h2>

          {!otpSent ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-style" required />
                <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="input-style" required>
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} className="input-style" min={18} required />
                <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-style" required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-style sm:col-span-2" required />
                <input type="text" placeholder="Language(s)" value={language} onChange={(e) => setLanguage(e.target.value)} className="input-style sm:col-span-2" required />
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="input-style"
                  required
                >
                  <option value="">Select Specialization</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.Departmentname}>
                      {dept.Departmentname}
                    </option>
                  ))}
                </select>
                <input type="number" placeholder="Years of Experience" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} className="input-style" min={0} required />
                <input type="number" placeholder="Consultation Fee" value={consultFee} onChange={(e) => setConsultFee(e.target.value)} className="input-style" min={0} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-style" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-gray-700">Profile Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage)} className="w-full" required />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">ID Proof</label>
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, setIdProof)} className="w-full" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-gray-700">Medical License</label>
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, setMedicalLicense)} className="w-full" required />
                </div>
              </div>
            </>
          ) : (
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full p-4 mb-6 border border-gray-300 focus:border-teal-500 outline-none rounded-2xl bg-teal-50 transition shadow" required />
          )}

          <button
            type="submit"
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg text-lg transition"
          >
            {otpSent ? Messages.DOCTOR.REGISTRATION.VERIFY_REGISTER : Messages.DOCTOR.REGISTRATION.SEND_OTP}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
