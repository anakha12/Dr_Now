import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../../services/userService";
import { motion } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { Messages } from "../../constants/messages";
import type { DoctorProfile } from "../../types/doctorProfile";
import logger from "../../utils/logger";
const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return addNotification(Messages.DOCTOR_PROFILE.ERROR_FETCH, "ERROR");

      try {
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        logger.error(error);
        addNotification(Messages.DOCTOR_PROFILE.ERROR_FETCH, "ERROR");
      }
    };

    fetchDoctor();
  }, [id, addNotification]);

  if (!doctor) {
    return (
      <div className="text-center py-20 text-teal-700 text-lg">
        {Messages.DOCTOR_PROFILE.LOADING}
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-teal-50 to-white py-10 px-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden md:flex">
        {/* Profile Section */}
        <motion.div
          className="md:w-1/3 bg-white p-6 flex flex-col items-center border-r border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-44 h-44 rounded-full object-cover border-4 border-teal-500 shadow-md"
            whileHover={{ scale: 1.05 }}
          />
          <h2 className="text-xl font-bold text-gray-800 mt-4 capitalize">
            Dr. {doctor.name}
          </h2>
          <p className="text-sm text-teal-600 font-medium">
            {doctor.specialization || "-"}
          </p>

          <motion.button
            onClick={() => navigate(`/user/book/${id}`)}
            className="mt-5 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white px-6 py-2 rounded-lg shadow-md transition"
            whileTap={{ scale: 0.95 }}
          >
            {Messages.DOCTOR_PROFILE.BOOK_APPOINTMENT}
          </motion.button>
        </motion.div>

        {/* Details Section */}
        <motion.div
          className="md:w-2/3 p-8 space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* About Section */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800">About</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">
              {doctor.bio || Messages.DOCTOR_PROFILE.NO_BIO}
            </p>
          </section>

          {/* Basic Info */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li><strong>Email:</strong> {doctor.email}</li>
              <li><strong>Phone:</strong> {doctor.phone || "-"}</li>
              <li><strong>Gender:</strong> {doctor.gender || "-"}</li>
              <li><strong>Experience:</strong> {doctor.yearsOfExperience || 0} years</li>
              <li><strong>Consultation Fee:</strong> ₹{doctor.consultFee || 0}</li>
            </ul>
          </section>

          {/* Experience */}
          {doctor.experience?.length ? (
            <section>
              <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {doctor.experience.map((exp, idx) => (
                  <li key={idx}>{exp.role} at {exp.hospital} ({exp.years} years)</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Education */}
          {doctor.education?.length ? (
            <section>
              <h3 className="text-xl font-semibold text-gray-800">Education</h3>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {doctor.education.map((edu, idx) => (
                  <li key={idx}>{edu.degree} from {edu.institution} ({edu.year})</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Awards */}
          {doctor.awards?.length ? (
            <section>
              <h3 className="text-xl font-semibold text-gray-800">Awards</h3>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {doctor.awards.map((award, idx) => (
                  <li key={idx}>{award}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Affiliated Hospitals */}
          {doctor.affiliatedHospitals?.length ? (
            <section>
              <h3 className="text-xl font-semibold text-gray-800">Affiliated Hospitals</h3>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {doctor.affiliatedHospitals.map((hosp, idx) => (
                  <li key={idx}>{hosp}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorDetail;
