import { useNavigate } from "react-router-dom";
import { FaStethoscope, FaHome, FaArrowLeft } from "react-icons/fa";
import medicalBg from "../assets/not-found.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6">

      {/* Brand */}
      <div className="flex items-center gap-2 mb-2">
        <FaStethoscope className="text-teal-600 text-3xl" />
        <span className="text-3xl font-bold text-gray-800">
          Dr<span className="text-teal-600">Now</span>
        </span>
      </div>

      {/* Image Container with overlay text */}
      <div className="relative w-full max-w-md mb-4">
        <img
          src={medicalBg}
          alt="Not Found"
          className="w-full object-contain"
        />

        {/* Overlay Text positioned above center */}
        <div className="absolute top-[7%] left-0 w-full text-center px-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Oops! This page is under treatment 
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            The page you're looking for might have been moved, removed, or is temporarily unavailable.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-sm"
        >
          <FaArrowLeft />
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition text-sm"
        >
          <FaHome />
          Home
        </button>
      </div>

    </div>
  );
};

export default NotFound;