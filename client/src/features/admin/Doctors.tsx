import { useEffect, useState } from "react";
import { getAllDoctors, toggleDoctorBlockStatus } from "../../services/adminService";
import toast from "react-hot-toast";

interface Doctor {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

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

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-teal-700 mb-6">All Doctors</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-teal-300 bg-white shadow-md rounded-lg">
          <thead className="bg-teal-100 text-teal-800 font-semibold">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">View Details</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-600 text-lg">
                  No doctors available.
                </td>
              </tr>
            ) : (
              currentDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b border-teal-100 hover:bg-teal-50">
                  <td className="p-4">{doctor.name}</td>
                  <td className="p-4">{doctor.email}</td>
                  <td className="p-4">
                    <span
                      className={`font-semibold ${
                        doctor.isBlocked ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {doctor.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleBlockToggle(doctor.id, doctor.isBlocked)}
                      className={`px-4 py-2 rounded-lg text-white font-medium shadow transition ${
                        doctor.isBlocked
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {doctor.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleViewDetails(doctor.id)}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium shadow"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 max-w-xs mx-auto">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-teal-200 text-teal-800 font-semibold disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-teal-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-teal-200 text-teal-800 font-semibold disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Doctors;
