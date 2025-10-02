import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getUnverifiedDoctors, 
  verifyDoctorById, 
  rejectDoctorById 
} from "../../services/adminService";
import type { Doctor } from "../../types/doctor";
import { Messages } from "../../constants/messages";
import { useNotifications } from "../../context/NotificationContext";

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
        addNotification(Messages.DOCTOR.FETCH_FAILED);
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
      addNotification(Messages.DOCTOR.VERIFY_SUCCESS);
    } catch {
      addNotification( Messages.DOCTOR.VERIFY_FAILED);
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
      addNotification( Messages.DOCTOR.REJECT_SUCCESS);
    } catch {
      addNotification( Messages.DOCTOR.REJECT_FAILED);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-teal-700 font-medium">
        {Messages.DOCTOR.LOADING}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">
          Doctor Verification
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Name</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Department</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Status</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Details</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  {Messages.DOCTOR.NO_RESULTS}
                </td>
              </tr>
            ) : (
              paginatedDoctors.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-teal-50">
                  <td className="px-6 py-4">{doc.name}</td>
                  <td className="px-6 py-4">{doc.specialization}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/doctor-verification/${doc.id}`}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleApprove(doc.id)}
                      className="px-4 py-2 rounded text-white font-medium bg-green-500 hover:bg-green-600 shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doc.id)}
                      className="px-4 py-2 rounded text-white font-medium bg-red-500 hover:bg-red-600 shadow"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorVerification;
