import { useEffect, useState } from "react";
import { addDepartmentSchema } from "../../validation/departmentSchema";
import { useNotifications } from "../../context/NotificationContext";
import {
  getAllDepartments,
  toggleDepartmentStatus,
  addDepartment,
} from "../../services/adminService";
import type { Department, DepartmentResponse } from "../../types/department";
import { Messages } from "../../constants/messages";
import { ZodError } from "zod";
import { handleError } from "../../utils/errorHandler"; 

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

  const fetchDepartments = async () => {
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
      const error = handleError(err, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
      addNotification(error.message, "ERROR");
    }
  };

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
  }, [currentPage, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-700">Departments</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search"
            className="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "+ Add Department"}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-teal-100 mb-6">
          <h3 className="text-xl font-semibold mb-4 text-center text-teal-800">
            Add New Department
          </h3>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="Enter department name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              placeholder="Enter description"
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              onClick={handleAddDepartment}
            >
              Save
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-teal-100">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-teal-800">
                Name
              </th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">
                Description
              </th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-teal-800">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-b hover:bg-teal-50">
                  <td className="px-6 py-4">{dept.Departmentname}</td>
                  <td className="px-6 py-4">{dept.Description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        dept.status === "Listed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(dept.id, dept.status)}
                      className={`px-4 py-2 rounded text-white font-medium transition shadow ${
                        dept.status === "Listed"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
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

      {/* Pagination */}
      {totalPages > 1 && (
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
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

export default DepartmentList;
