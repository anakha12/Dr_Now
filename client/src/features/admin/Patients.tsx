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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-teal-800 mb-6">All Patients</h1>

      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-teal-300 bg-white shadow-md rounded-lg">
            <thead className="bg-teal-200 text-teal-800 font-semibold">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-600 text-lg">
                    No patients available.
                  </td>
                </tr>
              ) : (
                currentPatients.map((user) => (
                  <tr key={user._id} className="border-b border-teal-100 hover:bg-teal-50">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          user.isBlocked ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked || false)}
                        className={`px-4 py-2 rounded-lg text-white font-medium shadow transition ${
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
      )}

      {!loading && (
        <div className="flex justify-between items-center mt-6 max-w-xs mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-teal-200 text-teal-700 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-teal-800 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-teal-200 text-teal-700 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Patients;
