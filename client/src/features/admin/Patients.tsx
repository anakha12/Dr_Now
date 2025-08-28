import { useEffect, useState } from "react";
import { getAllUsers, toggleUserBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import Table, { type Column } from "../../components/Table";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked?: boolean;
}

const Patients = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const patientsPerPage = 5;

  const fetchPatients = async () => {
    try {
      const data = await getAllUsers(currentPage, patientsPerPage, searchQuery);
      setPatients(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchQuery]);

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await toggleUserBlockStatus(id, isBlocked ? "unblock" : "block");
      toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
      fetchPatients();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleViewDetails = (id: string) => {
    alert(`View details for doctor ID: ${id}`);
  };

  const columns: Column<User>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: (user) => (
        <span className={`font-semibold ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (user) => (
        <button
          onClick={() => handleToggleBlock(user.id, user.isBlocked || false)}
          className={`px-4 py-2 rounded text-white font-medium transition shadow ${
            user.isBlocked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">All Patients</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <Table data={patients} columns={columns} onViewDetails={handleViewDetails} emptyMessage="No patients found." />

      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
