import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "../features/admin/AdminLogin";
import AdminLayout from "../features/admin/AdminLayout";
import AdminDashboard from "../features/admin/AdminDashboard";
import DoctorVerification from "../features/admin/DoctorVerification";
import Doctors from "../features/admin/Doctors";
import Patients from "../features/admin/Patients";
import { useEffect, useState } from "react";
import adminAxios from "../services/adminAxiosInstance";
import DepartmentList from "../features/admin/DepartmentList";
import DoctorPaymentPage from "../features/admin/DoctorPaymentPage";

const AdminRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    if (location.pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    adminAxios
      .get("/protected", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Admin not authenticated", error?.response?.data);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" />
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctor-verification" element={<DoctorVerification />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="departments" element={<DepartmentList/>}/>
        <Route path="doctor-payment" element={<DoctorPaymentPage/>}/>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
