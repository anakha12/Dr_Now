import { motion } from "framer-motion";
import { User as UserIcon, Phone, FileText, Calendar, X, GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import type { Doctor } from "../../types/doctor";

interface DoctorDetailsProps {
  doctor: Doctor;
  onClose: () => void;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
    <div className="p-2 bg-white rounded-md shadow-sm border border-slate-200 text-teal-600 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-semibold text-slate-800 text-sm">{value}</p>
    </div>
  </div>
);

const DoctorDetails = ({ doctor, onClose }: DoctorDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-sans">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header (Sticky) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white rounded-t-xl shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Doctor Profile</h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (if needed) */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={doctor.profileImage || "/default-avatar.png"}
                alt={doctor.name}
                className="w-24 h-24 rounded-xl border border-slate-200 shadow-sm object-cover"
              />
              <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-lg border bg-white shadow-sm ${doctor.isBlocked ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
                {doctor.isBlocked ? 'Blocked' : 'Active'}
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
              <p className="text-slate-500 font-medium text-sm">{doctor.email}</p>
              {doctor.bio && (
                <p className="text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {doctor.bio}
                </p>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">Professional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoItem icon={UserIcon} label="Specialization" value={doctor.specialization || "N/A"} />
              <InfoItem icon={Phone} label="Contact Number" value={doctor.phone || "N/A"} />
              <InfoItem icon={Calendar} label="Experience" value={`${doctor.yearsOfExperience ?? 0} Years`} />
              <InfoItem icon={UserIcon} label="Gender" value={doctor.gender || "N/A"} />
              <InfoItem icon={FileText} label="Consultation Fee" value={`₹${doctor.consultFee ?? "N/A"}`} />
              <InfoItem icon={Briefcase} label="Wallet Balance" value={`₹${doctor.walletBalance ?? 0}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Education */}
            {doctor.education && doctor.education.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                  Education
                </h3>
                <div className="space-y-2">
                  {doctor.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{edu.degree}</p>
                        <p className="text-xs text-slate-500">{edu.institution} &bull; {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {doctor.experience && doctor.experience.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  Experience
                </h3>
                <div className="space-y-2">
                  {doctor.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{exp.role}</p>
                        <p className="text-xs text-slate-500">{exp.hospital} &bull; {exp.years} yrs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verification Documents */}
          <div className="pt-1">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">Verification Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctor.medicalLicense && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-slate-600">Medical License</p>
                  </div>
                  <div className="p-3 flex justify-center bg-white">
                    <img
                      src={doctor.medicalLicense}
                      alt="Medical License"
                      className="max-h-48 object-contain rounded border border-slate-100 shadow-sm"
                    />
                  </div>
                </div>
              )}
              {doctor.idProof && (
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200">
                    <p className="text-[10px] uppercase font-bold text-slate-600">ID Proof</p>
                  </div>
                  <div className="p-3 flex justify-center bg-white">
                    <img
                      src={doctor.idProof}
                      alt="ID Proof"
                      className="max-h-48 object-contain rounded border border-slate-100 shadow-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white font-medium text-sm rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDetails;
