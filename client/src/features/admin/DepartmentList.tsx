import { useEffect, useState, useCallback } from "react";
import { addDepartmentSchema } from "../../validation/departmentSchema";
import { useNotifications } from "../../hooks/useNotifications";

import {
  getAllDepartments,
  toggleDepartmentStatus,
  addDepartment,
} from "../../services/adminService";
import type { Department, DepartmentResponse } from "../../types/department";
import { Messages } from "../../constants/messages";
import { ZodError } from "zod";
import { handleError } from "../../utils/errorHandler"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaPlus,
  FaCheckCircle, 
  FaTimesCircle, 
} from "react-icons/fa";

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addNotification } = useNotifications();
  const itemsPerPage = 5;

  const fetchDepartments = useCallback(async () => {
    try {
      const data: DepartmentResponse = await getAllDepartments(
        currentPage,
        itemsPerPage,
        searchQuery
      );

      if (data?.departments) {
        setDepartments(data.departments);
        setTotalPages(data.totalPages);
      }
    } catch (err: unknown) {
      const error = handleError(
        err,
        Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED
      );
      addNotification(error.message, "ERROR");
    }
  }, [currentPage, itemsPerPage, searchQuery, addNotification]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "Listed" | "Unlisted"
  ) => {
    try {
      const newStatus = currentStatus === "Listed" ? "Unlisted" : "Listed";
      await toggleDepartmentStatus(id, newStatus);
      addNotification(`Department ${newStatus}`, "SUCCESS");
      fetchDepartments();
    } catch (err: unknown) {
      const error = handleError(err, "Error updating status");
      addNotification(error.message, "ERROR");
    }
  };

  const handleAddDepartment = async () => {
    try {

      addDepartmentSchema.parse({
        Departmentname: newDeptName,
        Description: newDescription,
      });

      await addDepartment({
        Departmentname: newDeptName,
        Description: newDescription,
      });

      addNotification(Messages.AVAILABILITY.ADD_RULE_SUCCESS, "SUCCESS");
      setNewDeptName("");
      setNewDescription("");
      setShowAddForm(false);
      fetchDepartments();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        err.issues.forEach((issue) => {
          addNotification(issue.message, "ERROR");
        });
      }
      else if (err instanceof Error) {
      addNotification(err.message, "ERROR");
      } else {
        const error = handleError(err, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
        
        addNotification(error.message, "ERROR");
      }
    }
  };

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchDepartments();
  }, 400);

  return () => clearTimeout(delayDebounce);
}, [fetchDepartments]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Departments
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage hospital departments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400 text-sm" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search departments..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>
          <button
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showAddForm 
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 outline outline-1 outline-slate-200' 
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : <><FaPlus className="text-xs" /> Add Department</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {/* Add Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">
                Add New Department
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                    placeholder="e.g. Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={1}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm resize-none"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-5">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium text-sm shadow-sm transition-colors"
                  onClick={handleAddDepartment}
                >
                  Save Department
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{dept.Departmentname}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500 line-clamp-2 max-w-md">{dept.Description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        dept.status === "Listed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {dept.status === "Listed" ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(dept.id, dept.status)}
                        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          dept.status === "Listed"
                            ? "bg-white border border-red-300 text-red-700 hover:bg-red-50"
                            : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {dept.status === "Listed" ? "Unlist" : "List"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Container inside card */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
