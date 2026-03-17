import { useEffect, useState, useCallback } from "react";
import { getAllUsers, toggleUserBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import type { Column } from "../../types/table";
import { Messages } from "../../constants/messages";
import type { AdminUser } from "../../types/userProfile";
import PatientDetails from "./PatientDetails";
import logger from "../../utils/logger";
import { FaSearch } from "react-icons/fa";

const Patients = () => {
  const [patients, setPatients] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const patientsPerPage = 5;

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(
        currentPage,
        patientsPerPage,
        searchQuery,
        genderFilter,
        statusFilter,
        undefined,
        undefined,
        sortOption
      );

      setPatients(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(Messages.USER.FETCH_FAILED);
      logger.error(error)
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, genderFilter, statusFilter, sortOption]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [fetchPatients]);

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
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (user: AdminUser) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleBlock(user.id!, user.isBlocked || false);
          }}
          className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            user.isBlocked
              ? "bg-white border border-green-300 text-green-700 hover:bg-green-50"
              : "bg-white border border-red-300 text-red-700 hover:bg-red-50"
          }`}
        >
          {user.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {selectedUser ? (
        <PatientDetails
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      ) : (
        <>
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Patients
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Manage patient applications and statuses.</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400 text-sm" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
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
              <label className="block text-xs font-medium text-slate-500 mb-1">Gender</label>
              <select 
                value={genderFilter} 
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setCurrentPage(1);
                }} 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
              >
                <option value="">Sort</option>
                <option value="NAME_ASC">Name A-Z</option>
                <option value="NAME_DESC">Name Z-A</option>
                <option value="AGE_ASC">Age Low-High</option>
                <option value="AGE_DESC">Age High-Low</option>
                <option value="REGISTERED_ASC">Oldest First</option>
                <option value="REGISTERED_DESC">Newest First</option>
              </select>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
              <Table
                data={patients}
                columns={columns}
                rowKey="id"
                onViewDetails={handleViewDetails}
                emptyMessage="No patients found."
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
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

export default Patients;
