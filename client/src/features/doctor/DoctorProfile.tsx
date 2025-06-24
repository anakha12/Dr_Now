import { useEffect, useState } from "react";
import { getDoctorProfile, updateDoctorProfile } from "../../services/doctorService";
import toast, { Toaster } from "react-hot-toast";

const DoctorProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    yearsOfExperience: 0,
    specialization: "",
    profileImage: "",
    medicalLicense: "",
    idProof: "",
    gender: "",
    consultFee: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getDoctorProfile()
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load profile");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.yearsOfExperience || form.yearsOfExperience < 0)
      newErrors.yearsOfExperience = "Enter valid experience";
    if (!form.specialization.trim()) newErrors.specialization = "Specialization is required";
    if (!form.gender.trim()) newErrors.gender = "Gender is required";
    if (!form.consultFee || isNaN(Number(form.consultFee)))
      newErrors.consultFee = "Valid consult fee is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    updateDoctorProfile(form)
      .then(() => {
        toast.success("Profile updated successfully");
        setEditMode(false);
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fadeIn border border-teal-100">
      <h2 className="text-3xl font-bold mb-6 text-teal-700 text-center">
        {editMode ? "Edit Your Profile" : "Doctor Profile"}
      </h2>

      {!editMode ? (
        <>
          <div className="space-y-4 text-gray-700 text-lg">
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Experience:</strong> {form.yearsOfExperience} years</p>
            <p><strong>Specialization:</strong> {form.specialization}</p>
            <p><strong>Gender:</strong> {form.gender}</p>
            <p><strong>Consult Fee:</strong> ₹{form.consultFee}</p>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setEditMode(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
               Edit Profile
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", placeholder: "Full Name" },
            { name: "phone", placeholder: "Phone Number" },
            { name: "yearsOfExperience", placeholder: "Years of Experience", type: "number" },
            { name: "specialization", placeholder: "Specialization" },
            { name: "gender", placeholder: "Gender" },
            { name: "consultFee", placeholder: "Consultation Fee" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={(form as any)[name]}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-4 justify-center pt-4">
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default DoctorProfile;
