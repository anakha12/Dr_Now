import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import { useNotifications } from "../../context/NotificationContext";
import {
  getAllDoctors,
  toggleDoctorBlockStatus,
  getDoctorById,
} from "../../services/adminService";
import { Messages } from "../../constants/messages";
import DoctorDetails from "./DoctorDetails";
import type { Doctor } from "../../types/doctor";
import type { Column } from "../../types/table";
import { handleError } from "../../utils/errorHandler"; 

interface DoctorResponse {
  doctors: Doctor[];
  totalPages: number;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const doctorsPerPage = 5;
  const { addNotification } = useNotifications();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data: DoctorResponse = await getAllDoctors(
        currentPage,
        doctorsPerPage,
        searchQuery
      );
      setDoctors(data.doctors);
      setTotalPages(data.totalPages);
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.FETCH_FAILED);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchQuery]);

  const handleBlockToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleDoctorBlockStatus(id, currentStatus ? "unblock" : "block");
      const msg = currentStatus
        ? Messages.DOCTOR.UNBLOCK_SUCCESS
        : Messages.DOCTOR.BLOCK_SUCCESS;
      addNotification(msg, "SUCCESS");
      fetchDoctors();
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.ACTION_FAILED);
      addNotification(err.message, "ERROR");
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      setLoading(true);
      const doctor: Doctor = await getDoctorById(id);
      setSelectedDoctor(doctor);
    } catch (error: unknown) {
      const err = handleError(error, Messages.DOCTOR.FETCH_FAILED);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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
          onClick={() => handleBlockToggle(doctor.id, doctor.isBlocked ?? false)}
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
      {selectedDoctor ? (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      ) : (
        <>
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

          {/* Table */}
          <Table
            data={doctors}
            columns={columns}
            rowKey="id"
            onViewDetails={handleViewDetails}
            emptyMessage="No doctors available."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || loading}
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

export default Doctors;
