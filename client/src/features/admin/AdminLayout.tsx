import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../redux/slices/authSlice";
import { Messages } from "../../constants/messages";
import { adminSidebarItems } from "../../constants/sidebar";
import Sidebar from "../../components/Sidebar";
import { AdminRoutes } from "../../constants/routes";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const active = location.pathname.split("/")[2] || "dashboard";

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      dispatch(adminLogout());
      toast.success(Messages.AUTH.LOGOUT_SUCCESS);
      navigate(AdminRoutes.LOGIN);
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-teal-50 via-white to-teal-100">
      {/* Sidebar */}
      <Sidebar
        items={adminSidebarItems}
        activeKey={active}
        onItemClick={handleSidebarClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-end items-center h-16 px-8 bg-white/80 border-b border-teal-200 shadow-sm">
          <button
            onClick={() => {
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
