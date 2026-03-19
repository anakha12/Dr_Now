import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoctorById } from "../../services/userService";
import { motion, type Variants } from "framer-motion";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages } from "../../constants/messages";
import type { DoctorProfile } from "../../types/doctorProfile";
import logger from "../../utils/logger";
import { FaGraduationCap, FaHospitalUser, FaTrophy, FaUserMd } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden relative pb-20">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-teal-100/60 blur-3xl opacity-70"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-100/60 blur-3xl opacity-60"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 hover:border-teal-500 text-slate-700 font-bold shadow-sm transition-all hover:text-teal-600 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </motion.button>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8 xl:gap-12"
        >
          {/* Left Profile Sidebar */}
          <motion.div variants={fadeInUp} className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center text-center relative overflow-hidden group top-0 sticky">
              {/* Card top banner */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-teal-500 to-emerald-600 z-0"></div>
              
              <div className="relative z-10 mt-12 mb-6">
                <div className="absolute inset-0 bg-teal-400 blur-lg opacity-20 rounded-full"></div>
                <img
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto relative z-10"
                />
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 capitalize mb-1">
                Dr. {doctor.name}
              </h2>
              
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-bold mb-6">
                <FaUserMd />
                <span>{doctor.specialization || "General Specialist"}</span>
              </div>

              <div className="w-full h-px bg-slate-100 mb-6"></div>

              <div className="flex justify-between w-full text-slate-600 mb-8 px-2">
                <div className="flex flex-col items-center flex-1 border-r border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Experience</span>
                  <span className="text-slate-900 font-bold text-lg">{doctor.yearsOfExperience || 0}<span className="text-sm font-medium text-slate-500 ml-1">yrs</span></span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Consult Fee</span>
                  <span className="text-teal-600 font-bold text-lg">₹{doctor.consultFee || 0}</span>
                </div>
              </div>

              <motion.button
                onClick={() => navigate(`/book/${id}`)}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
                whileTap={{ scale: 0.98 }}
              >
                {Messages.DOCTOR_PROFILE.BOOK_APPOINTMENT}
              </motion.button>
            </div>
          </motion.div>

          {/* Right Details Container */}
          <div className="w-full lg:w-2/3 xl:w-3/4 space-y-8">
            {/* About Section */}
            <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                  👋
                </div>
                About Doctor
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {doctor.bio || Messages.DOCTOR_PROFILE.NO_BIO}
              </p>
            </motion.div>

            {/* Sub-grid for Info & Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  Contact Information
                </h3>
                <div className="space-y-6 text-slate-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                      <MdOutlineEmail />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Email</p>
                      <p className="font-medium text-slate-900 break-all">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
                      <MdOutlinePhone />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Phone</p>
                      <p className="font-medium text-slate-900">{doctor.phone || "Not available"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl shrink-0">
                      👤
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Gender</p>
                      <p className="font-medium text-slate-900 capitalize">{doctor.gender || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Experience Matrix/Stats if applicable */}
              <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
                 <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  Professional Experience
                </h3>
                {doctor.experience?.length ? (
                  <div className="space-y-6">
                    {doctor.experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-4">
                         <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full border-4 border-teal-500 bg-white"></div>
                            {idx !== doctor.experience!.length - 1 && <div className="w-px h-full bg-slate-200 my-1"></div>}
                         </div>
                         <div className="pb-4">
                           <h4 className="font-bold text-slate-900">{exp.role}</h4>
                           <p className="text-slate-600 text-sm font-medium flex items-center gap-1 mt-1">
                             <FaHospitalUser className="text-teal-500" /> {exp.hospital}
                           </p>
                           <p className="text-slate-400 text-xs mt-1 font-bold">{exp.years} Years</p>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                    No timeline data available.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Other Sections (Education, Awards, Affiliations) */}
            <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/40 border border-slate-100 p-8 md:p-10">
               <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                 Credentials & Achievements
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Education */}
                  {doctor.education?.length ? (
                    <div>
                      <h4 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
                        <FaGraduationCap className="text-teal-500 text-lg" /> Education
                      </h4>
                      <ul className="space-y-4">
                        {doctor.education.map((edu, idx) => (
                          <li key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="font-bold text-slate-900">{edu.degree}</p>
                            <p className="text-sm text-slate-600 mt-1">{edu.institution}</p>
                            <span className="inline-block mt-2 text-xs font-bold bg-white text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                              {edu.year}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Arrays (Awards, Hospitals) */}
                  <div className="space-y-8">
                    {/* Affiliated Hospitals */}
                    {doctor.affiliatedHospitals?.length ? (
                      <div>
                        <h4 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
                          <FaHospitalUser className="text-teal-500 text-lg" /> Affiliated Hospitals
                        </h4>
                        <ul className="flex flex-wrap gap-2">
                          {doctor.affiliatedHospitals.map((hosp, idx) => (
                            <li key={idx} className="bg-teal-50 text-teal-700 font-medium text-sm px-4 py-2 rounded-full">
                              {hosp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Awards */}
                    {doctor.awards?.length ? (
                      <div>
                        <h4 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
                          <FaTrophy className="text-amber-500 text-lg" /> Awards & Recognitions
                        </h4>
                        <ul className="space-y-2">
                          {doctor.awards.map((award, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-700">
                              <span className="text-amber-500 mt-0.5">•</span> 
                              <span>{award}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDetail;
