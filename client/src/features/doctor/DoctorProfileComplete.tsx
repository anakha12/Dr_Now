import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa";
import { completeDoctorProfile } from "../../services/doctorService";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { handleError } from "../../utils/errorHandler";


interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  hospital: string;
  role: string;
  years: string;
}

const DoctorProfileComplete = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Retrieve stored registration details
  const doctorId = localStorage.getItem("doctorId");
  const storedName = localStorage.getItem("doctorName") || "";
  const storedGender = localStorage.getItem("doctorGender") || "";
  const storedSpecialization = localStorage.getItem("doctorSpecialization") || "";
  const storedConsultFee = localStorage.getItem("doctorConsultFee") || "";

  // New fields for profile completion
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState<Education[]>([{ degree: "", institution: "", year: "" }]);
  const [awards, setAwards] = useState<string[]>([""]);
  const [experience, setExperience] = useState<Experience[]>([{ hospital: "", role: "", years: "" }]);
  const [affiliatedHospitals, setAffiliatedHospitals] = useState("");

  useEffect(() => {

    if (!doctorId) {
      addNotification(Messages.DOCTOR.PROFILE_UPDATE_FAILED, "ERROR");
      navigate("/doctor/register");
    }
  }, []);

  if (!doctorId) return null;

 
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const handleAwardChange = (index: number, value: string) => {
    const updated = [...awards];
    updated[index] = value;
    setAwards(updated);
  };

  const addEducation = () => setEducation([...education, { degree: "", institution: "", year: "" }]);
  const addExperience = () => setExperience([...experience, { hospital: "", role: "", years: "" }]);
  const addAward = () => setAwards([...awards, ""]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData = {
      name: storedName,
      specialization: storedSpecialization,
      gender: storedGender,
      consultFee: Number(storedConsultFee),
      bio,
      education: education.filter((edu) => edu.degree && edu.institution && edu.year),
      awards: awards.filter((a) => a.trim() !== ""),
      experience: experience.filter((exp) => exp.hospital && exp.role && exp.years),
      affiliatedHospitals: affiliatedHospitals
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
    };

    try {
      await completeDoctorProfile(doctorId, profileData);

      // Clean up localStorage
      localStorage.removeItem("doctorId");
      localStorage.removeItem("doctorName");
      localStorage.removeItem("doctorGender");
      localStorage.removeItem("doctorSpecialization");
      localStorage.removeItem("doctorConsultFee");

      addNotification(Messages.DOCTOR.PROFILE_UPDATE_SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/doctor/login"), 1500);
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.PROFILE_UPDATE_FAILED);
      addNotification(err.message, "ERROR");
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-2 py-8">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 sm:p-10 bg-white/90 rounded-[2.5rem] shadow-2xl border border-gray-200 backdrop-blur-lg"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">DrNow</span>
            </div>
            <p className="text-sm text-gray-500">Complete Your Profile</p>
          </div>

          {/* Prefilled Details */}
          <div className="mb-6 text-gray-700 space-y-2 bg-gray-50 p-4 rounded-xl border">
            <p><strong>Name:</strong> {storedName}</p>
            <p><strong>Gender:</strong> {storedGender}</p>
            <p><strong>Specialization:</strong> {storedSpecialization}</p>
            <p><strong>Consult Fee:</strong> ₹{storedConsultFee}</p>
          </div>

          {/* Bio */}
          <textarea
            placeholder="Write a short bio about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-style w-full mb-4 h-24 border-gray-300 rounded-xl p-3"
          />

          {/* Education Section */}
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Education</h3>
          {education.map((edu, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(i, "degree", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(i, "institution", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => handleEducationChange(i, "year", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
            </div>
          ))}
          <button type="button" onClick={addEducation} className="text-teal-600 text-sm mb-4">
            + Add More Education
          </button>

          {/* Awards */}
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Awards</h3>
          {awards.map((award, i) => (
            <input
              key={i}
              type="text"
              placeholder="Award / Recognition"
              value={award}
              onChange={(e) => handleAwardChange(i, e.target.value)}
              className="input-style w-full mb-2 border p-2 rounded-xl"
            />
          ))}
          <button type="button" onClick={addAward} className="text-teal-600 text-sm mb-4">
            + Add More Awards
          </button>

          {/* Experience */}
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Experience</h3>
          {experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Hospital"
                value={exp.hospital}
                onChange={(e) => handleExperienceChange(i, "hospital", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(i, "role", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Years"
                value={exp.years}
                onChange={(e) => handleExperienceChange(i, "years", e.target.value)}
                className="input-style border p-2 rounded-xl"
              />
            </div>
          ))}
          <button type="button" onClick={addExperience} className="text-teal-600 text-sm mb-4">
            + Add More Experience
          </button>

          {/* Affiliated Hospitals */}
          <h3 className="font-semibold text-lg text-gray-700 mb-2">Affiliated Hospitals</h3>
          <input
            type="text"
            placeholder="Hospital names separated by commas"
            value={affiliatedHospitals}
            onChange={(e) => setAffiliatedHospitals(e.target.value)}
            className="input-style w-full mb-4 border p-2 rounded-xl"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg text-lg transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfileComplete;
