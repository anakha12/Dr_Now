import { Link, Outlet } from "react-router-dom";
import { FaStethoscope } from "react-icons/fa";
import NotificationBell from "../notifications/NotificationBell";


const UserLayout = () => {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaStethoscope className="text-teal-600 text-2xl" />
            <h1 className="text-xl font-bold text-teal-600">MedConsult</h1>
          </div>
          <nav className="flex items-center gap-6 text-sm md:text-base">
            <Link to="/user/dashboard" className="hover:text-teal-600">Home</Link>
            <Link to="/services" className="hover:text-teal-600">Services</Link>
            <Link to="/about" className="hover:text-teal-600">About</Link>
            <Link to="/contact" className="hover:text-teal-600">Contact</Link>
            <Link to="/user/profile" className="hover:text-teal-600">Profile</Link>
            <Link to="/user/notifications" className="relative"><NotificationBell /></Link>
            <Link to="/user/login" className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700">Login</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-20">
        <div className="container mx-auto px-4 py-10 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} MedConsult. All rights reserved.</p>
          <p>Providing trusted care to patients and support to doctors.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
