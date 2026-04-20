import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { persistor } from "../../redux/store";
import { doctorLogout } from "../../redux/slices/authSlice";
import { doctorSidebarItems } from "../../constants/sidebar";
import Sidebar from "../../components/Sidebar";
import AppNotificationDropdown from "../notifications/AppNotificationDropdown";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  
  const doctor = useSelector((state: RootState) => state.doctorAuth.user);

  const active = location.pathname.split("/")[2] || "dashboard";

  const handleSidebarClick = async (key: string) => {
    if (key === "logout") {
      dispatch(doctorLogout());
      await persistor.purge();
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
        <header className="flex justify-between items-center h-16 px-8 bg-white border-b border-teal-200 shadow">
         
          <h2 className="text-lg font-semibold text-teal-700">
            {doctor?.name || "Doctor"}
          </h2>

          <div className="flex items-center gap-6">
            <AppNotificationDropdown />
            <button
              onClick={async () => {
                dispatch(doctorLogout());
                await persistor.purge();
                navigate("/doctor/login");
              }}
              className="py-2 px-5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm transition"
            >
              Logout
            </button>
          </div>
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
