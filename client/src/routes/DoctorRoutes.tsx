import { Routes, Route, Navigate } from "react-router-dom";
import DoctorRegister from "../features/doctor/DoctorRegister";
import DoctorLogin from "../features/doctor/DoctorLogin";
import DoctorWaitingVerification from "../features/doctor/waiting-verification";
import DoctorRejected from "../features/doctor/DoctorRejected";
import DoctorLayout from "../features/doctor/DoctorLayout";
import Dashboard from "../features/doctor/DoctorDashboard";
import DoctorProfileComponent from "../features/doctor/DoctorProfile";
import CurrentSchedules from "../features/doctor/CurrentSchedules";
import DoctorAppointments from "../features/doctor/DoctorAppointments";
import DoctorWallet from "../features/doctor/DoctorWallet";
import DoctorProfileComplete from "../features/doctor/DoctorProfileComplete";
import DoctorBookingDetails from "../features/doctor/DoctorBookingDetails";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import NotFound from "../features/NotFound";
import DoctorChatPage from "../features/doctor/DoctorChatPage";
import DoctorPrescription from "../features/doctor/DoctorPrescription";
import PrescriptionView from "../features/doctor/PrescriptionView";


const DoctorRoutes = () => {

  const isDoctorLoggedIn  = useSelector(
    (state: RootState) => state.doctorAuth.isAuthenticated
  );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="register" element={<DoctorRegister />} />
       <Route path="profile-complete" element={<DoctorProfileComplete />} />
      <Route path="login" element={<DoctorLogin />} />
      <Route path="waiting-verification" element={<DoctorWaitingVerification />} />
      <Route path="rejected" element={<DoctorRejected />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          isDoctorLoggedIn ? (
            <DoctorLayout />
          ) : (
            <Navigate to="/doctor/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<DoctorProfileComponent />} />
        <Route path="current-schedules" element={<CurrentSchedules/>}/>
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="wallet" element={<DoctorWallet />} />
        <Route path="/bookings/:id" element={<DoctorBookingDetails />} />
        <Route path="/chat/:bookingId" element={<DoctorChatPage />} />
        <Route path="/bookings/:id/prescription" element={<DoctorPrescription />} />
        <Route path="/bookings/:id/prescription/view" element={<PrescriptionView />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default DoctorRoutes;
