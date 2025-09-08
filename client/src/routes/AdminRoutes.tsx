import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "../features/admin/AdminLogin";
import AdminLayout from "../features/admin/AdminLayout";
import AdminDashboard from "../features/admin/AdminDashboard";
import DoctorVerification from "../features/admin/DoctorVerification";
import Doctors from "../features/admin/Doctors";
import Patients from "../features/admin/Patients";
import DepartmentList from "../features/admin/DepartmentList";
import DoctorPaymentPage from "../features/admin/DoctorPaymentPage";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const AdminRoutes = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login"  state={{ form: location}}/>
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
