import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, registerDoctor,getAllDepartments } from "../../services/doctorService";
import toast, { Toaster } from "react-hot-toast";
import { FaStethoscope } from "react-icons/fa";

const DoctorRegister = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
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
  const [departments, setDepartments] = useState<{ _id: string; Departmentname: string }[]>([]);

  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const trimmed = (val: string) => val.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (
      !trimmed(name) || !trimmed(gender) || !trimmed(age) || !trimmed(email) ||
      !trimmed(phone) || !trimmed(language) || !trimmed(specialization) ||
      !trimmed(yearsOfExperience) || !trimmed(consultFee) || !trimmed(password) ||
      !profileImage || !idProof || !medicalLicense
    ) {
      toast.error("Please fill in all fields and upload documents.");
      return false;
    }

    if (!emailRegex.test(trimmed(email))) {
      toast.error("Invalid email.");
      return false;
    }

    if (!phoneRegex.test(trimmed(phone))) {
      toast.error("Invalid phone number.");
      return false;
    }

    if (Number(age) < 18 || Number(yearsOfExperience) < 0 || Number(consultFee) < 0) {
      toast.error("Check age, experience, and consultation fee.");
      return false;
    }

    return true;
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
    formData.append("specialisation", specialization);
    formData.append("yearsOfExperience", yearsOfExperience);
    formData.append("consultFee", consultFee);
    formData.append("password", password);
    if (profileImage) formData.append("profileImage", profileImage);
    if (idProof) formData.append("idProof", idProof);
    if (medicalLicense) formData.append("medicalLicense", medicalLicense);

    try {
      await sendOtp(formData);
      setOtpSent(true);
      toast.success("OTP sent. Please check your email.");
    } catch {
      toast.error("Failed to send OTP.");
    }
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
      } catch {
        toast.error("Unable to load specializations");
      }
    };
    fetchDepartments();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerDoctor(email, otp);
      const doctorId = response.doctorId;
      sessionStorage.setItem("doctorId", doctorId); 
      toast.success("Registration successful!");
      setTimeout(() => navigate("/doctor/profile-complete", { state: { email } }), 1500);
    } catch {
      toast.error("Invalid OTP. Try again.");
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
          {/* ---- Logo ---- */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">MedConsult</span>
            </div>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {otpSent ? "Enter OTP" : "Doctor Registration"}
          </h2>

          {!otpSent ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-style" required />
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-style" required>
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
                    <option key={dept._id} value={dept.Departmentname}>
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
            {otpSent ? "Verify & Register" : "Send OTP"}
          </button>
        </form>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </div>
  );
};

export default DoctorRegister;
