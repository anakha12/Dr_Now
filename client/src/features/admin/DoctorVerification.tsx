import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUnverifiedDoctors } from "../../services/adminService"; 
import { verifyDoctorById } from "../../services/adminService"; 
import { rejectDoctorById } from "../../services/adminService";

const ITEMS_PER_PAGE = 5;

interface Doctor {
  id: string;      
  name: string;
  specialization: string; 
  isVerified: boolean;
 
}

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getUnverifiedDoctors();
        setDoctors(data);
      } catch (err) {
        console.error((err as Error).message);
      } finally {
        setLoading(false);  
      }
    };

    fetchDoctors();
  }, []);


  // Pagination logic
  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = doctors.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handleApprove = async (doctorId: string) => {
    try {
      await verifyDoctorById(doctorId);
      setDoctors(prev => prev.filter(doc => doc.id !== doctorId )
    );
    } catch (err) {
      console.error("Error approving doctor:", (err as Error).message);
    }
  }

  const handleReject = async (doctorId: string) => {
    try {
      await rejectDoctorById(doctorId);
      setDoctors(prev => prev.filter(doc => doc.id !== doctorId));
    } catch (error) {
      console.error("Error rejecting doctor:", (error as Error).message);
    }
  }

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-teal-700 mb-6">Doctor Verification</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-teal-100 text-teal-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No doctors to verify.
                </td>
              </tr>
            ) : (
              paginatedDoctors.map((doc) => (
               <tr key={String(doc.id)} className="border-b last:border-b-0">
                  <td className="py-3 px-4">{doc.name}</td>
                  <td className="py-3 px-4">{doc.specialization}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/doctor-verification/${doc.id}`}
                      className="text-teal-600 hover:underline font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {/* You can implement Approve/Reject buttons here and call your API */}
                    <button onClick={()=>handleApprove(doc.id)} className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                      Approve
                    </button>
                    <button onClick={()=>handleReject(doc.id)} className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600">
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-teal-200 text-teal-700 font-semibold disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-teal-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-teal-200 text-teal-700 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
