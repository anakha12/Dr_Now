import { useEffect, useState } from "react";
import { getAllUsers, toggleUserBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import Table from "../../components/Table"; 
import type { Column } from "../../types/table";  
import { Messages } from "../../constants/messages";
import type { AdminUser } from "../../types/userProfile";  
import PatientDetails from "./PatientDetails"; 

const Patients = () => {
  const [patients, setPatients] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null); 
  const patientsPerPage = 2;

  const fetchPatients = async () => {
    try {
      const data = await getAllUsers(currentPage, patientsPerPage, searchQuery);
      setPatients(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(Messages.USER.FETCH_FAILED);
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
      toast.success(
        isBlocked
          ? Messages.USER.UNBLOCK_SUCCESS
          : Messages.USER.BLOCK_SUCCESS
      );
      fetchPatients();
    } catch {
      toast.error(Messages.USER.ACTION_FAILED);
    }
  };

  // ✅ Show PatientDetails instead of alert
  const handleViewDetails = (id: string) => {
    const user = patients.find((u) => u.id === id);
    if (user) setSelectedUser(user);
  };

  const columns: Column<AdminUser>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: (user: AdminUser) => (
        <span className={`font-semibold ${user.isBlocked ? "text-red-600" : "text-green-600"}`}>
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (user: AdminUser) => (
        <button
          onClick={() => handleToggleBlock(user.id!, user.isBlocked || false)}
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
      
      {selectedUser ? (
        <PatientDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      ) : (
        <>
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

          <Table 
            data={patients} 
            columns={columns} 
            onViewDetails={handleViewDetails} 
            emptyMessage="No patients found." 
          />

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
        </>
      )}
    </div>
  );
};

export default Patients;
