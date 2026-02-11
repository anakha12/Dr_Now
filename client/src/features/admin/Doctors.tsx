import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import type { Department } from "../../types/department"; 
import { useNotifications } from "../../context/NotificationContext";
import {
  getAllDoctors,
  toggleDoctorBlockStatus,
  getDoctorById,
} from "../../services/adminService";
import {  getAllDepartments } from "../../services/doctorService";
import { Messages } from "../../constants/messages";
import DoctorDetails from "./DoctorDetails";
import type { Doctor } from "../../types/doctor";
import type { Column } from "../../types/table";
import { handleError } from "../../utils/errorHandler";

interface DoctorResponse {
  doctors: Doctor[];
  totalPages: number;
  currentPage: number;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const doctorsPerPage = 5;
  const { addNotification } = useNotifications();

  useEffect(() => {
      const fetchDepartments = async () => {
        try {
          const data = await getAllDepartments();
          setDepartments(data); 
        } catch {
          addNotification(Messages.DOCTOR.REGISTRATION.DEPARTMENTS_FETCH_FAILED, "ERROR");
        }
      };
      fetchDepartments();
    }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const data: DoctorResponse = await getAllDoctors({
        page: currentPage,
        limit: doctorsPerPage,
        search: searchQuery,
        status,
        specialization,
        sort,
      });

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
  }, [currentPage, searchQuery, status, specialization, sort]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

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
          onClick={() =>
            handleBlockToggle(doctor.id, doctor.isBlocked ?? false)
          }
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
    <div className="max-w-6xl mx-auto p-4">
      {selectedDoctor ? (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      ) : (
        <>
          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              All Doctors
            </h2>

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search name or email..."
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-600"
              />

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* Specialization Filter */}
              <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} 
               className="px-4 py-2 border rounded-md">
                  <option value="">Select Specialization</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.Departmentname}>
                      {dept.Departmentname}
                    </option>
                  ))}
              </select>


              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-md"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="name_asc">Name A → Z</option>
                <option value="name_desc">Name Z → A</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <Table
            data={doctors}
            columns={columns}
            rowKey="id"
            onViewDetails={handleViewDetails}
            emptyMessage="No doctors found."
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
