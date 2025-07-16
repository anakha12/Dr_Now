import { useEffect, useState } from "react";
import { getAllDoctors, toggleDoctorBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";

interface Doctor {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const doctorsPerPage = 5;

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors(currentPage, doctorsPerPage);
      setDoctors(data.doctors);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [currentPage]);

  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleDoctorBlockStatus(id, currentStatus ? "unblock" : "block");
      toast.success(`Doctor ${currentStatus ? "unblocked" : "blocked"} successfully`);
      fetchDoctors();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleViewDetails = (id: string) => {
    alert(`View details for doctor ID: ${id}`);
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">All Doctors</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Name</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Email</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Status</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Action</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">View</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No doctors available.
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b hover:bg-teal-50">
                  <td className="px-6 py-4">{doctor.name}</td>
                  <td className="px-6 py-4">{doctor.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        doctor.isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {doctor.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBlockToggle(doctor.id, doctor.isBlocked)}
                      className={`px-4 py-2 rounded text-white font-medium shadow transition ${
                        doctor.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {doctor.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(doctor.id)}
                      className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white font-medium shadow"
                    >
                      View Details
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

export default Doctors;
