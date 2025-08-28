import { useEffect, useState } from "react";
import { getAllDoctors, toggleDoctorBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import Table, { type Column } from "../../components/Table"; 

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
  const [searchQuery, setSearchQuery] = useState("");
  const doctorsPerPage = 5;

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors(currentPage, doctorsPerPage, searchQuery);
      setDoctors(data.doctors);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchQuery]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  
  const columns: Column<Doctor>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: (doctor) => (
        <span
          className={`font-semibold ${
            doctor.isBlocked ? "text-red-600" : "text-green-600"
          }`}
        >
          {doctor.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (doctor) => (
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
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-teal-700">All Doctors</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 w-full sm:w-72"
        />
      </div>

      {/* ✅ Use Reusable Table */}
      <Table
        data={doctors}
        columns={columns}
        onViewDetails={handleViewDetails}
        emptyMessage="No doctors available."
      />

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
