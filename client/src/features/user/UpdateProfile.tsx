import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { updateUserProfile, getUserProfile } from "../../services/userService"; 
import type { UserProfile } from "../../types/userProfile";
import { z } from "zod";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../utils/errorHandler"; 

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string().optional(),
  address: z.string().min(5, "Address too short"),
  age: z.coerce.number().min(1, "Age must be positive").optional(),
  image: z.string().optional(),
});

const UpdateProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotifications();
  const navigate = useNavigate()

  useEffect(() => {
    getUserProfile()
      .then((data) => setFormData(data))
      .catch((err) => console.error(Messages.USER.UPDATE_FAILED, err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, value.toString());
      });
      if (selectedFile) data.append("file", selectedFile);

      await updateUserProfile(data);
      addNotification(Messages.USER.PROFILE_UPDATE_SUCCESS, "SUCCESS");
      navigate("/user/profile");

    } catch (error: unknown) {
      const err = handleError(error, Messages.USER.UPDATE_FAILED);
      addNotification(err.message, "ERROR");  
  };
  }
  if (!formData) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
          Update Profile
        </h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={preview || formData.image || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 shadow-lg"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
            <input
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-teal-600 text-white rounded-xl font-semibold shadow-md hover:bg-teal-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
