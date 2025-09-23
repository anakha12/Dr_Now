import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLogout } from "../../redux/slices/authSlice";
import { profileSidebarItems } from "../../constants/sidebar";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const active = location.pathname.split("/")[2] || "profile";

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      dispatch(userLogout());
      navigate("/user/login");
    } else {
      navigate(`/user/${key}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 space-y-6 rounded-tr-3xl rounded-br-3xl">
        <div className="text-lg font-semibold text-teal-700 mb-4">User Menu</div>

        <nav className="space-y-4 text-sm">
          {profileSidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleSidebarClick(item.key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                active === item.key
                  ? "bg-teal-600 text-white shadow"
                  : "text-gray-700 hover:bg-teal-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
