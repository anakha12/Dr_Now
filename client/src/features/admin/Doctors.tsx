import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import type { Department } from "../../types/department"; 
import { useNotifications } from "../../hooks/useNotifications";

import {
  getAllDoctors,
  toggleDoctorBlockStatus,
  getDoctorById,
} from "../../services/adminService";
import { getAllDepartments } from "../../services/doctorService";
import { Messages } from "../../constants/messages";
import DoctorDetails from "./DoctorDetails";
import type { Doctor } from "../../types/doctor";
import type { Column } from "../../types/table";
import { handleError } from "../../utils/errorHandler";
import { FaSearch } from "react-icons/fa";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDoctors = useCallback(async () => {
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
  }, [currentPage, searchQuery, status, specialization, sort]);

  useEffect(() => {
    const delayDebounce = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(delayDebounce);
  }, [fetchDoctors]);

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
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const columns: Column<Doctor>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: (doctor) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            doctor.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
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
          onClick={(e) => {
            e.stopPropagation();
            handleBlockToggle(doctor.id, doctor.isBlocked ?? false);
          }}
          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            doctor.isBlocked
              ? "bg-white border border-green-300 text-green-700 hover:bg-green-50"
              : "bg-white border border-red-300 text-red-700 hover:bg-red-50"
          }`}
        >
          {doctor.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {selectedDoctor ? (
        <DoctorDetails
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      ) : (
        <>
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Doctors
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Manage doctor profiles and statuses.</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400 text-sm" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* FILTERS SECTION */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Specialization</label>
              <select 
                value={specialization} 
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setCurrentPage(1);
                }} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="">All Specializations</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.Departmentname}>
                    {dept.Departmentname}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="name_asc">Name A → Z</option>
                <option value="name_desc">Name Z → A</option>
              </select>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
              <Table
                data={doctors}
                columns={columns}
                rowKey="id"
                onViewDetails={handleViewDetails}
                emptyMessage="No doctors found."
              />
            </div>
            
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-700">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Doctors;
