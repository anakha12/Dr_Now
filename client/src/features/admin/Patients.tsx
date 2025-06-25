import { useEffect, useState } from "react";
import { getAllUsers, toggleUserBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked?: boolean;
}

const Patients = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const fetchPatients = async () => {
    try {
      const data = await getAllUsers();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await toggleUserBlockStatus(id, isBlocked ? "unblock" : "block");
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchPatients();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">All Patients</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Name</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Email</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Status</th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No patients available.
                </td>
              </tr>
            ) : (
              currentPatients.map((user) => (
                <tr key={user._id} className="border-b hover:bg-teal-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        user.isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleBlock(user._id, user.isBlocked || false)}
                      className={`px-4 py-2 rounded text-white font-medium transition shadow ${
                        user.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
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

export default Patients;
