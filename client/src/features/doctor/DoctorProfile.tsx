import { useEffect, useState } from "react";
import {
  getDoctorProfile,
  updateDoctorProfile,
  getAllDepartments,
} from "../../services/doctorService";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import type { DoctorProfileForm } from "../../types/doctorProfileForm";
import { Messages } from "../../constants/messages"; 
import type { Department } from "../../types/department";


const DoctorProfileComponent  = () => {
  const [form, setForm] = useState<DoctorProfileForm>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    yearsOfExperience: 0,
    specialization: "",
    profileImage: "",
    medicalLicense: "",
    idProof: "",
    gender: "",
    consultFee:0,
    awards: [""],
    education: [{ degree: "", institution: "", year: "" }],
    experience: [{ hospital: "", role: "", years: "" }],
    affiliatedHospitals: [""],
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const [departments, setDepartments] = useState<Department[]>([]);
  const { addNotification, confirmMessage } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, deptList] = await Promise.all([
          getDoctorProfile(),
          getAllDepartments(),
        ]);

        setForm({
          ...form,
          ...profile,
          awards: profile.awards || [""],
          education: profile.education?.length
            ? profile.education
            : [{ degree: "", institution: "", year: "" }],
          experience: profile.experience?.length
            ? profile.experience
            : [{ hospital: "", role: "", years: "" }],
          affiliatedHospitals: profile.affiliatedHospitals || [""],
        });

        setDepartments(deptList || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        addNotification(Messages.DOCTOR.FETCH_FAILED, "ERROR");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (
    index: number,
    field: keyof DoctorProfileForm,
    value: any,
    key?: string
  ) => {
    const updatedArray = [...(form[field] as any[])];
    if (key) {
      updatedArray[index][key] = value;
    } else {
      updatedArray[index] = value;
    }
    setForm((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addField = (field: keyof DoctorProfileForm, template: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), template],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone?.trim()) newErrors.phone = "Phone is required";
    if (!form.yearsOfExperience || form.yearsOfExperience < 0)
      newErrors.yearsOfExperience = "Enter valid experience";
    if (!form.specialization.trim())
      newErrors.specialization = "Specialization is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";
    if (!form.consultFee || isNaN(Number(form.consultFee)))
      newErrors.consultFee = "Valid consult fee is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addNotification(Messages.COMMON.CONFIRM, "ERROR");
      return;
    }

    try {
      const res = await updateDoctorProfile(form);

      if (res?.message === "confirmation_required") {
        const confirmed = await confirmMessage(
          "Updating your profile will block your account temporarily. Proceed?"
        );
        if (!confirmed) return;

        const res2 = await updateDoctorProfile({ ...form, confirm: true });

        if (res2?.message === "confirmation_required") {
          addNotification(Messages.DOCTOR.ACTION_FAILED, "WARNING");
          return;
        }

        addNotification(Messages.DOCTOR.PROFILE_UPDATE_WITH_CONFIRM, "SUCCESS");
        setTimeout(() => {
          navigate("/user/login");
        }, 1500);
      } else {
        addNotification(Messages.DOCTOR.PROFILE_UPDATE_SUCCESS, "SUCCESS");
      }

      setEditMode(false);
    } catch (error: any) {
      addNotification(error.message || Messages.DOCTOR.PROFILE_UPDATE_FAILED, "ERROR");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-lg animate-fadeIn border border-teal-200">
      <h2 className="text-3xl font-bold mb-8 text-teal-700 text-center">
        {editMode ? "Edit Your Profile" : "Doctor Profile"}
      </h2>

      {!editMode ? (
        // --- DISPLAY MODE ---
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 text-base">
          <p><strong>Name:</strong> {form.name}</p>
          <p><strong>Email:</strong> {form.email}</p>
          <p><strong>Phone:</strong> {form.phone}</p>
          <p><strong>Experience:</strong> {form.yearsOfExperience} years</p>
          <p><strong>Specialization:</strong> {form.specialization}</p>
          <p><strong>Gender:</strong> {form.gender}</p>
          <p><strong>Consult Fee:</strong> ₹{form.consultFee}</p>
          <div className="sm:col-span-2">
            <p><strong>Bio:</strong> {form.bio}</p>
          </div>
          <div className="sm:col-span-2">
            <p><strong>Awards:</strong></p>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.awards.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p><strong>Education:</strong></p>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.education.map((e, i) => (
                <li key={i}>{e.degree}, {e.institution} ({e.year})</li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p><strong>Experience:</strong></p>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.experience.map((e, i) => (
                <li key={i}>{e.role} at {e.hospital} ({e.years})</li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <p><strong>Affiliated Hospitals:</strong></p>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.affiliatedHospitals.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
          <div className="sm:col-span-2 flex justify-center mt-8">
            <button
              onClick={() => setEditMode(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        // --- EDIT MODE ---
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {["name", "phone", "yearsOfExperience", "gender", "consultFee"].map((name) => (
            <div key={name} className="col-span-1">
              <input
                type={name === "yearsOfExperience" || name === "consultFee" ? "number" : "text"}
                name={name}
                placeholder={name.replace(/([A-Z])/g, " $1")}
                value={(form as any)[name]}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors[name] ? "border-red-500" : "border-gray-300"}`}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}

          <div className="col-span-1">
            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${errors.specialization ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Specialization</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.Departmentname}>
                  {dept.Departmentname}
                </option>
              ))}
            </select>
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <textarea
              name="bio"
              placeholder="Bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows={3}
            />
          </div>

          {/* Awards Section */}
          <div className="col-span-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 mb-1 block">Awards</label>
            {form.awards.map((value, i) => (
              <input
                key={i}
                value={value}
                onChange={(e) => handleArrayChange(i, "awards", e.target.value)}
                placeholder={`Award #${i + 1}`}
                className="w-full mb-2 border p-2 rounded-md focus:ring-2 focus:ring-teal-600"
              />
            ))}
            <button
              type="button"
              onClick={() => addField("awards", "")}
              className="text-sm text-teal-600 underline"
            >
              + Add another award
            </button>
          </div>

          {/* Education Section */}
          <div className="col-span-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 mb-1 block">Education</label>
            {form.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  value={edu.degree}
                  onChange={(e) => handleArrayChange(i, "education", e.target.value, "degree")}
                  placeholder="Degree"
                  className="border p-2 rounded"
                />
                <input
                  value={edu.institution}
                  onChange={(e) =>
                    handleArrayChange(i, "education", e.target.value, "institution")
                  }
                  placeholder="Institution"
                  className="border p-2 rounded"
                />
                <input
                  value={edu.year}
                  onChange={(e) => handleArrayChange(i, "education", e.target.value, "year")}
                  placeholder="Year"
                  className="border p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("education", { degree: "", institution: "", year: "" })}
              className="text-sm text-teal-600 underline"
            >
              + Add another education
            </button>
          </div>

          {/* Experience Section */}
          <div className="col-span-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 mb-1 block">Experience</label>
            {form.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  value={exp.hospital}
                  onChange={(e) =>
                    handleArrayChange(i, "experience", e.target.value, "hospital")
                  }
                  placeholder="Hospital"
                  className="border p-2 rounded"
                />
                <input
                  value={exp.role}
                  onChange={(e) => handleArrayChange(i, "experience", e.target.value, "role")}
                  placeholder="Role"
                  className="border p-2 rounded"
                />
                <input
                  value={exp.years}
                  onChange={(e) => handleArrayChange(i, "experience", e.target.value, "years")}
                  placeholder="Years"
                  className="border p-2 rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("experience", { hospital: "", role: "", years: "" })}
              className="text-sm text-teal-600 underline"
            >
              + Add another experience
            </button>
          </div>

          {/* Affiliated Hospitals Section */}
          <div className="col-span-1 sm:col-span-2">
            <label className="font-semibold text-gray-700 mb-1 block">Affiliated Hospitals</label>
            {form.affiliatedHospitals.map((value, i) => (
              <input
                key={i}
                value={value}
                onChange={(e) => handleArrayChange(i, "affiliatedHospitals", e.target.value)}
                placeholder={`Hospital #${i + 1}`}
                className="w-full mb-2 border p-2 rounded-md focus:ring-2 focus:ring-teal-600"
              />
            ))}
            <button
              type="button"
              onClick={() => addField("affiliatedHospitals", "")}
              className="text-sm text-teal-600 underline"
            >
              + Add another hospital
            </button>
          </div>

          <div className="col-span-1 sm:col-span-2 flex gap-4 justify-center pt-6">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition duration-300 shadow-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DoctorProfileComponent;
