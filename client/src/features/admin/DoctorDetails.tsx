import { motion } from "framer-motion";
import { User as UserIcon, Phone,  FileText, Calendar } from "lucide-react";
import type { Doctor } from "../../types/doctor";

interface DoctorDetailsProps {
  doctor: Doctor;
  onClose: () => void;
}

const DoctorDetails = ({ doctor, onClose }: DoctorDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 space-y-6 max-w-4xl w-full overflow-y-auto max-h-[90vh] border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Profile */}
        <div className="flex flex-col items-center">
          <img
            src={doctor.profileImage || "/default-avatar.png"}
            alt={doctor.name}
            className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-md object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{doctor.name}</h2>
          <p className="text-gray-500">{doctor.email}</p>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-gray-700">
          <div className="flex items-center space-x-3">
            <Phone className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold">{doctor.phone || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Years of Experience</p>
              <p className="font-semibold">{doctor.yearsOfExperience ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserIcon className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold">{doctor.gender || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UserIcon className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-semibold">{doctor.specialization || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Consultation Fee</p>
              <p className="font-semibold">₹{doctor.consultFee ?? "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="font-semibold">₹{doctor.totalEarned ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="text-teal-600 w-5 h-5" />
            <div>
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="font-semibold">₹{doctor.walletBalance ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700">Bio:</h3>
            <p className="text-gray-600">{doctor.bio}</p>
          </div>
        )}

        {/* Education */}
        {doctor.education && doctor.education.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700">Education:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {doctor.education.map((edu, idx) => (
                <li key={idx}>
                  {edu.degree} - {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {doctor.experience && doctor.experience.length > 0 && (
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700">Experience:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {doctor.experience.map((exp, idx) => (
                <li key={idx}>
                  {exp.hospital} - {exp.role} ({exp.years} years)
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctor.medicalLicense && (
            <div>
              <p className="font-semibold text-gray-700">Medical License:</p>
              <img
                src={doctor.medicalLicense}
                alt="Medical License"
                className="w-full max-w-xs rounded shadow"
              />
            </div>
          )}
          {doctor.idProof && (
            <div>
              <p className="font-semibold text-gray-700">ID Proof:</p>
              <img
                src={doctor.idProof}
                alt="ID Proof"
                className="w-full max-w-xs rounded shadow"
              />
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDetails;
