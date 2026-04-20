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
import NotFound from "../features/NotFound";

const AdminRoutes = () => {
  const location = useLocation();
  const adminAuth = useSelector((state: RootState) => state.adminAuth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isRehydrated = (adminAuth as any)._persist?.rehydrated ?? true;
  const isAuthenticated = adminAuth.isAuthenticated;

  // Wait for redux-persist to finish rehydrating before making redirect decisions
  if (!isRehydrated) return null;

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
        } 
      />
      <Route
        path="/"
        element={
          isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login"  state={{ form: location}}/>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctor-verification" element={<DoctorVerification />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="departments" element={<DepartmentList/>}/>
        <Route path="doctor-payment" element={<DoctorPaymentPage/>}/>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
