import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { FaStethoscope } from "react-icons/fa";

const sidebarItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Doctor Verification", key: "doctor-verification" },
  { label: "Doctors", key: "doctors" },
  { label: "Departments", key: "departments" },
  { label: "Patients", key: "patients" },
  { label: "Doctor Payment", key: "doctor-payment" },
  { label: "Crowdfunding Verification", key: "crowdfunding-verification" },
  { label: "Logout", key: "logout" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname.split("/")[2] || "dashboard";

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      localStorage.removeItem("adminToken");
      toast.success("Logged out successfully!");
      navigate("/admin/login");
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-teal-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 border-r border-teal-200 shadow-lg flex flex-col py-8 px-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 text-teal-700">
            <FaStethoscope className="text-2xl" />
            <span className="text-xl font-bold">MedConsult</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${
                    active === item.key
                      ? "bg-teal-600 text-white shadow"
                      : "text-teal-700 hover:bg-teal-100"
                  }`}
                  onClick={() => handleSidebarClick(item.key)}
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
        {/* Top Bar */}
        <header className="flex justify-end items-center h-16 px-8 bg-white/80 border-b border-teal-200 shadow-sm">
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/admin/login");
            }}
            className="py-2 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow transition"
          >
            Logout
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-white/90 rounded-tr-xl overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AdminLayout;
