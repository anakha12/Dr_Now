import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getUnverifiedDoctors, 
  verifyDoctorById, 
  rejectDoctorById 
} from "../../services/adminService";
import type { Doctor } from "../../types/doctor";
import { Messages } from "../../constants/messages";
import { useNotifications } from "../../hooks/useNotifications";
import { FileCheck } from "lucide-react";

import logger from "../../utils/logger";

const ITEMS_PER_PAGE = 5;

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addNotification, promptInput } = useNotifications();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getUnverifiedDoctors(currentPage, ITEMS_PER_PAGE);
        setDoctors(data.doctors);
      } catch (err) {
        logger.error(err);
        addNotification(Messages.DOCTOR.FETCH_FAILED, "ERROR");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, addNotification]);

  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = doctors.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleApprove = async (doctorId: string) => {
    try {
      await verifyDoctorById(doctorId);
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
      addNotification(Messages.DOCTOR.VERIFY_SUCCESS, "SUCCESS");
    } catch {
      addNotification(Messages.DOCTOR.VERIFY_FAILED, "ERROR");
    }
  };

  const handleReject = async (doctorId: string) => {
    try {
      const reason = await promptInput("Please enter the reason for rejection:", "Reason...");
      if (!reason) {
        addNotification("Rejection cancelled", "WARNING");
        return;
      }

      await rejectDoctorById(doctorId, reason);
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
      addNotification(Messages.DOCTOR.REJECT_SUCCESS, "SUCCESS");
    } catch {
      addNotification(Messages.DOCTOR.REJECT_FAILED, "ERROR");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Doctor Verification
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Review and approve new doctor registrations.</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 flex items-center gap-2 text-sm font-medium">
          <FileCheck className="w-4 h-4" />
          {doctors.length} Pending
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200 overflow-x-auto`}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 text-sm">
                    Loading verification requests...
                  </td>
                </tr>
              ) : paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500 text-sm bg-slate-50/50">
                    {Messages.DOCTOR.NO_RESULTS}
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{doc.specialization}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/doctor-verification/${doc.id}`}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline"
                      >
                        Review Profile
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold bg-white border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVerification;
