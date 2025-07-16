import { useEffect, useState } from "react";
import { getFilteredDoctors } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { FaUserMd } from "react-icons/fa";
import { MdWork, MdCurrencyRupee } from "react-icons/md";
import { motion } from "framer-motion";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage: string;
  yearsOfExperience: number;
  consultFee: number;
  gender: string;
}

const DoctorListing = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState(1000);
  const [genderFilter, setGenderFilter] = useState("");
  const [specializations, setSpecializations] = useState<{ id: string; Departmentname: string }[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const data = await getFilteredDoctors({
        search,
        specialization: specializationFilter,
        maxFee: feeFilter,
        gender: genderFilter,
        page,
      });

      setDoctors(data.doctors);
      setSpecializations(data.specializations);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [search, specializationFilter, feeFilter, genderFilter, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50 py-10 px-4 md:px-10 lg:px-20">
      <motion.h1
        className="text-4xl font-extrabold text-center text-teal-800 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Find the <span className="text-teal-500">Best Doctors</span>
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters */}
        <motion.div
          className="w-full lg:w-1/4 bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-6 space-y-6 shadow-lg"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder=" Search by name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div>
            <label className="block font-semibold text-gray-700 mb-1"> Department</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="">All</option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.Departmentname}>
                  {spec.Departmentname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1"> Max Fee: ₹{feeFilter}</label>
            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={feeFilter}
              onChange={(e) => setFeeFilter(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1"> Gender</label>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-2">
              {["", "male", "female"].map((gender) => (
                <label key={gender}>
                  <input
                    type="radio"
                    value={gender}
                    checked={genderFilter === gender}
                    onChange={() => setGenderFilter(gender)}
                  />{" "}
                  {gender === "" ? "All" : gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Doctor Cards */}
        <motion.div
          className="w-full lg:w-3/4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc, i) => (
              <motion.div
                key={doc.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.03] p-6 text-center border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${doc.profileImage}`}
                  alt={doc.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-teal-500 object-cover"
                />
                <h3 className="text-lg font-bold text-teal-800 capitalize">{doc.name}</h3>

                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <FaUserMd className="text-blue-600" />
                    <span>{doc.specialization}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <MdWork className="text-green-600" />
                    <span>{doc.yearsOfExperience}+ Yrs Exp</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <MdCurrencyRupee className="text-yellow-600" />
                    <span>{doc.consultFee}</span>
                  </div>
                </div>

                <button
                  className="mt-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
                  onClick={() => navigate(`/user/consult/doctor/${doc.id}`)}
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 transition"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    page === i + 1
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorListing;
