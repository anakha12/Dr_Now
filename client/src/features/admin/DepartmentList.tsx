import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNotifications } from "../../context/NotificationContext";
import {
  getAllDepartments,
  toggleDepartmentStatus,
  addDepartment,
} from "../../services/adminService";

interface Department {
  id: string;
  Departmentname: string;
  Description: string;
  status: "Listed" | "Unlisted";
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { addNotification } = useNotifications();
  const itemsPerPage = 5;

  const fetchDepartments = async () => {
    try {
      const data = await getAllDepartments(currentPage, itemsPerPage);
      setDepartments(data?.departments || []);
    } catch (err: any) {
      addNotification(err.message || "Failed to load departments.", "error");
    }
  };

  const handleToggleStatus = async (
    id: string,
    currentStatus: "Listed" | "Unlisted"
  ) => {
    try {
      const newStatus = currentStatus === "Listed" ? "Unlisted" : "Listed";
      await toggleDepartmentStatus(id, newStatus);
      addNotification(`Department ${newStatus}`, "success");
      fetchDepartments();
    } catch (err: any) {
      addNotification(err.message || "Error updating status", "error");
    }
  };

  const handleAddDepartment = async () => {
    if (!newDeptName.trim() || !newDescription.trim()) {
      return toast.error("All fields are required.");
    }

    try {
      await addDepartment({
        Departmentname: newDeptName,
        Description: newDescription,
      });

      addNotification("Department added successfully", "success");
      setNewDeptName("");
      setNewDescription("");
      setShowAddForm(false);
      fetchDepartments();
    } catch (err: any) {
      addNotification(err.message || "Failed to add department", "error");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage]);

  return (
  <div className="max-w-4xl mx-auto p-4">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-teal-700">Departments</h2>
      <button
        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Close Form" : "+ Add Department"}
      </button>
    </div>

    {/* Show ONLY the Add Form */}
    {showAddForm ? (
      <div className="bg-white p-6 rounded-xl shadow-md border border-teal-100 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-4 text-center text-teal-800">Add New Department</h3>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Enter department name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
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
    ) : (
      <>
        {/* Table of Departments */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-teal-100">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-teal-800">Name</th>
                <th className="px-6 py-3 text-left font-medium text-teal-800">Description</th>
                <th className="px-6 py-3 text-left font-medium text-teal-800">Status</th>
                <th className="px-6 py-3 text-left font-medium text-teal-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} className="border-b">
                  <td className="px-6 py-4">{dept.Departmentname}</td>
                  <td className="px-6 py-4">{dept.Description}</td>
                  <td className="px-6 py-4">{dept.status}</td>
                  <td className="px-6 py-4">
                    <button
                      className={`px-3 py-1 rounded text-white ${
                        dept.status === "Listed"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      onClick={() => handleToggleStatus(dept.id, dept.status)}
                    >
                      {dept.status === "Listed" ? "Unlist" : "List"}
                    </button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage}</span>
          <button
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
);

};

export default DepartmentList;
