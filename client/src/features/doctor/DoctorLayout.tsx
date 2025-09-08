import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { doctorLogout } from "../../redux/slices/authSlice";

const sidebarItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Appointments", key: "appointments" },
  { label: "Current Schedules", key: "current-schedules" },
  { label: "Chat", key: "chat" },
  { label: "Wallet", key: "wallet" },
  { label: "Profile", key: "profile" },
  { label: "Logout", key: "logout" },
];

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()

  const active = location.pathname.split("/")[2] || "dashboard";

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      dispatch(doctorLogout())
      navigate("/doctor/login");
    } else {
      navigate(`/doctor/${key}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-teal-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-teal-200 shadow-xl flex flex-col py-8 px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <FaStethoscope className="text-teal-600 text-2xl" />
          <h2 className="text-xl font-bold text-teal-700 tracking-wide">MedConsult</h2>
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => handleSidebarClick(item.key)}
                  className={`w-full text-left px-5 py-2.5 rounded-lg font-medium transition
                    ${
                      active === item.key
                        ? "bg-teal-600 text-white shadow"
                        : "text-teal-700 hover:bg-teal-100"
                    }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

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
