import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa";
import { completeDoctorProfile } from "../../services/doctorService";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";

const DoctorProfileComplete = () => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gender, setGender] = useState("");
  const [consultFee, setConsultFee] = useState<number>(0);

  const [bio, setBio] = useState("");
  const [education, setEducation] = useState([{ degree: "", institution: "", year: "" }]);
  const [awards, setAwards] = useState([""]);
  const [experience, setExperience] = useState([{ hospital: "", role: "", years: "" }]);
  const [affiliatedHospitals, setAffiliatedHospitals] = useState("");

  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorId");
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!doctorId) {
      addNotification(Messages.DOCTOR.PROFILE_UPDATE_FAILED, "ERROR");
      navigate("/doctor/register");
    }
  }, [doctorId, navigate]);

  if (!doctorId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !specialization || !gender || !consultFee) {
      addNotification(Messages.COMMON.INPUT_PLACEHOLDER, "ERROR");
      return;
    }

    const profileData = {
      name,
      specialization,
      gender,
      consultFee,
      bio,
      education: education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
      })),
      awards,
      experience: experience.map((exp) => ({
        hospital: exp.hospital,
        role: exp.role,
        years: exp.years,
      })),
      affiliatedHospitals: affiliatedHospitals
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
    };

    try {
      await completeDoctorProfile(doctorId, profileData);
      localStorage.removeItem("doctorId");
      addNotification(Messages.DOCTOR.PROFILE_UPDATE_SUCCESS, "SUCCESS");
      setTimeout(() => navigate("/doctor/login"), 1500);
    } catch (error: any) {
      addNotification(error.message || Messages.DOCTOR.PROFILE_UPDATE_FAILED, "ERROR");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-2 py-8">
      <div className="w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 sm:p-10 bg-white/90 rounded-[2.5rem] shadow-2xl border border-gray-200 backdrop-blur-lg"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <FaStethoscope className="text-teal-600 text-3xl" />
              <span className="text-3xl font-bold text-teal-700">MedConsult</span>
            </div>
            <p className="text-sm text-gray-500">Complete Your Profile</p>
          </div>

          {/* Required Fields */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-style w-full mb-4"
            required
          />

          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="input-style w-full mb-4"
            required
          />

          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-style w-full mb-4"
            required
          />

          <input
            type="number"
            placeholder="Consult Fee"
            value={consultFee}
            onChange={(e) => setConsultFee(Number(e.target.value))}
            className="input-style w-full mb-4"
            required
          />

          {/* Bio */}
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-style w-full mb-4 h-24"
          />

          {/* Education */}
          <div className="mb-4">
            <label className="font-semibold">Education</label>
            {education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[index].degree = e.target.value;
                    setEducation(updated);
                  }}
                  className="input-style"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[index].institution = e.target.value;
                    setEducation(updated);
                  }}
                  className="input-style"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => {
                    const updated = [...education];
                    updated[index].year = e.target.value;
                    setEducation(updated);
                  }}
                  className="input-style"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setEducation([...education, { degree: "", institution: "", year: "" }])
              }
              className="text-teal-600 text-sm"
            >
              + Add more
            </button>
          </div>

          {/* Awards */}
          <div className="mb-4">
            <label className="font-semibold">Awards</label>
            {awards.map((award, index) => (
              <input
                key={index}
                type="text"
                placeholder="Award"
                value={award}
                onChange={(e) => {
                  const updated = [...awards];
                  updated[index] = e.target.value;
                  setAwards(updated);
                }}
                className="input-style mb-2"
              />
            ))}
            <button
              type="button"
              onClick={() => setAwards([...awards, ""])}
              className="text-teal-600 text-sm"
            >
              + Add more
            </button>
          </div>

          {/* Experience */}
          <div className="mb-4">
            <label className="font-semibold">Experience</label>
            {experience.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Hospital"
                  value={exp.hospital}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].hospital = e.target.value;
                    setExperience(updated);
                  }}
                  className="input-style"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].role = e.target.value;
                    setExperience(updated);
                  }}
                  className="input-style"
                />
                <input
                  type="text"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].years = e.target.value;
                    setExperience(updated);
                  }}
                  className="input-style"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setExperience([...experience, { hospital: "", role: "", years: "" }])
              }
              className="text-teal-600 text-sm"
            >
              + Add more
            </button>
          </div>

          {/* Affiliated Hospitals */}
          <input
            type="text"
            placeholder="Affiliated Hospitals (comma separated)"
            value={affiliatedHospitals}
            onChange={(e) => setAffiliatedHospitals(e.target.value)}
            className="input-style w-full mb-6"
          />

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
