import { useEffect, useState, useCallback } from "react";
import { getFilteredDoctors } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { FaUserMd } from "react-icons/fa";
import { MdWork, MdCurrencyRupee } from "react-icons/md";
import { motion, type Variants } from "framer-motion";
import type { Doctor } from "../../types/doctor";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages } from "../../constants/messages";
import logger from "../../utils/logger";
import type { FiltersProps,DoctorCardsProps } from "../../types/doctorListingFilterProps";

// ---------------------- Animations ----------------------
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

// ---------------------- Main Component ----------------------
const DoctorListing = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState(1000);
  const [genderFilter, setGenderFilter] = useState("");
  const [specializations, setSpecializations] = useState<{ id: string; Departmentname: string }[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch doctors from API
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFilteredDoctors({
        search: debouncedSearch,
        specialization: specializationFilter,
        maxFee: feeFilter,
        gender: genderFilter,
        page,
      });

      setDoctors(data.doctors || []);
      setSpecializations(data.specializations || []);
      setTotalPages(data.pagination?.totalPages || 1);

      if (!data.doctors || data.doctors.length === 0) {
        addNotification(Messages.DOCTOR.LISTING.NO_DOCTORS, "INFO");
      }
    } catch (error) {
      logger.error("Error fetching doctors:", error);
      addNotification(Messages.DOCTOR.LISTING.FETCH_ERROR, "ERROR");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, specializationFilter, feeFilter, genderFilter, page, addNotification]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-200 border-t-teal-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-16 flex items-center justify-center bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[50%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-teal-50/80 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] -right-[10%] w-[35vw] h-[35vw] rounded-full bg-blue-50/80 blur-3xl opacity-70"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.div
              variants={fadeInUp}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 font-bold text-xs tracking-widest uppercase"
            >
              Our Experts
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">Best Doctors</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Browse our directory of certified professionals and find the perfect specialist for your medical needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
            <Filters
              search={search}
              setSearch={setSearch}
              specializationFilter={specializationFilter}
              setSpecializationFilter={setSpecializationFilter}
              feeFilter={feeFilter}
              setFeeFilter={setFeeFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              specializations={specializations}
            />
            <DoctorCards doctors={doctors} page={page} totalPages={totalPages} handlePageChange={handlePageChange} navigate={navigate} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorListing;

// ---------------------- Filters Component ----------------------
const Filters = ({
  search,
  setSearch,
  specializationFilter,
  setSpecializationFilter,
  feeFilter,
  setFeeFilter,
  genderFilter,
  setGenderFilter,
  specializations,
}: FiltersProps) => (
  <motion.div
    className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 border border-slate-100 h-fit sticky top-8"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <div className="mb-8">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Filters</h3>
      <div className="w-12 h-1.5 bg-teal-500 rounded-full" />
    </div>

    <div className="space-y-8">
      {/* Search */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Search Doctor</label>
        <div className="relative">
          <input
            type="text"
            placeholder="E.g. John Doe..."
            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 font-medium text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</div>
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Department</label>
        <div className="relative">
          <select
            className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium text-slate-900 appearance-none"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="">All Specialties</option>
            {specializations.map((spec) => (
              <option key={spec.id} value={spec.Departmentname}>
                {spec.Departmentname}
              </option>
            ))}
          </select>
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🩺</div>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
        </div>
      </div>

      {/* Fee */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max Fee</label>
          <span className="text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-full text-sm">₹{feeFilter}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={50}
          value={feeFilter}
          onChange={(e) => setFeeFilter(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
        <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
          <span>₹0</span>
          <span>₹2000</span>
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Gender</label>
        <div className="flex flex-col gap-4">
          {["", "male", "female"].map((gender) => (
            <label key={gender} className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center w-6 h-6">
                <input
                  type="radio"
                  value={gender}
                  checked={genderFilter === gender}
                  onChange={() => setGenderFilter(gender)}
                  className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-full checked:border-teal-500 transition-colors cursor-pointer"
                />
                <div className="absolute w-3 h-3 bg-teal-500 rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
              </div>
              <span className="text-slate-600 text-lg font-medium group-hover:text-slate-900 transition-colors">
                {gender === "" ? "Any Gender" : gender.charAt(0).toUpperCase() + gender.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// ---------------------- DoctorCards Component ----------------------
const DoctorCards = ({ doctors, page, totalPages, handlePageChange, navigate }: DoctorCardsProps) => (
  <motion.div className="w-full lg:w-2/3 xl:w-3/4" initial="hidden" animate="visible" variants={staggerContainer}>
    {doctors.length === 0 ? (
      <motion.div variants={fadeInUp} className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
        <div className="text-6xl mb-4">🩺</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No doctors found</h3>
        <p className="text-slate-500">Try adjusting your filters to find who you're looking for.</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <motion.div
            key={doc.id}
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/user/consult/doctor/${doc.id}`)}
            className="bg-white rounded-[2rem] p-8 text-center shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-900/10 transition-all border border-slate-100 cursor-pointer group flex flex-col h-full"
          >
            <div className="relative inline-block mb-6 mx-auto">
              <div className="absolute inset-0 bg-teal-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full z-0" />
              <img
                src={doc.profileImage}
                alt={doc.name}
                className="relative w-32 h-32 rounded-full border-4 border-white shadow-md object-cover group-hover:scale-105 transition-transform duration-300 z-10"
              />
            </div>
            
            <h3 className="text-2xl font-extrabold text-slate-900 capitalize mb-2">{doc.name}</h3>
            
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-bold mb-6 mx-auto">
              <FaUserMd />
              <span>{doc.specialization}</span>
            </div>

            <div className="flex items-center justify-between pt-6 mt-auto border-t border-slate-100 text-slate-600 font-medium w-full">
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1 font-bold">
                  <MdWork className="text-sm" /> Exp
                </span>
                <span className="text-slate-900 font-bold">{doc.yearsOfExperience} yrs</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1 font-bold">
                  <MdCurrencyRupee className="text-sm" /> Fee
                </span>
                <span className="text-teal-600 font-bold">₹{doc.consultFee}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}

    {/* Pagination */}
    {totalPages > 1 && (
      <motion.div variants={fadeInUp} className="flex justify-center mt-14 gap-3">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-bold shadow-sm disabled:opacity-50 disabled:hover:border-slate-200 transition-all flex items-center gap-2"
        >
          <span>←</span> Prev
        </button>
        <div className="hidden sm:flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`w-12 h-12 rounded-full font-bold transition-all ${
                page === i + 1
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/30"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-teal-500 text-slate-700 font-bold shadow-sm disabled:opacity-50 disabled:hover:border-slate-200 transition-all flex items-center gap-2"
        >
          Next <span>→</span>
        </button>
      </motion.div>
    )}
  </motion.div>
);