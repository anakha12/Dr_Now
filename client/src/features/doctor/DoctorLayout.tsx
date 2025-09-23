import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doctorLogout } from "../../redux/slices/authSlice";
import { doctorSidebarItems } from "../../constants/sidebar";
import Sidebar from "../../components/Sidebar";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const active = location.pathname.split("/")[2] || "dashboard";

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      dispatch(doctorLogout());
      navigate("/doctor/login");
    } else {
      navigate(`/doctor/${key}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-teal-100">
      {/* Sidebar */}
      <Sidebar
        items={doctorSidebarItems}
        activeKey={active}
        onItemClick={handleSidebarClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center h-16 px-8 bg-white border-b border-teal-200 shadow">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/doctor/login");
            }}
            className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-white/90 overflow-auto rounded-tr-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
