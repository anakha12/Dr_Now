import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserRegister from "../features/user/UserRegister";
import UserLogin from "../features/user/UserLogin";
import Dashboard from "../features/user/Dashboard";
import OnlineConsultation from "../features/user/OnlineConsultation";
import VerifyOtp from "../features/user/VerifyOtp";
import ForgotPassword from "../features/user/ForgotPassword";
import UserLayout from "../features/user/UserLayout";
import DoctorDetail from "../features/user/DoctorDetail";
import BookAppointment from "../features/user/BookAppointment";
import Success from "../features/user/success";
import UserProfile from "../features/user/UserProfile";
import UserBookings from "../features/user/UserBookings";
import ProfileLayout from "../features/user/ProfileLayout";
import UserNotifications from "../features/user/UserNotifications";
import UserWallet from "../features/user/UserWallet";
import DoctorListing from "../features/user/DoctorListing";
import BookingDetails from "../features/user/BookingDetails";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const UserRoutes = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);

  return (
    <Routes>
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/verify-otp" element={<VerifyOtp />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/user"
        element={
          isAuthenticated ? <UserLayout /> : <Navigate to="/user/login" state={{ from: location}}/>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="online-consultation" element={<OnlineConsultation />} />
        <Route path="/user/doctors" element={<DoctorListing />} />
        <Route path="consult/doctor/:id" element={<DoctorDetail />} />
        <Route path="book/:id" element={<BookAppointment />} />
        <Route path="success" element={<Success />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="/user/bookings/:id" element={<BookingDetails />} />
        {/* ProfileLayout nested routes */}
        <Route path="" element={<ProfileLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="wallet" element={<UserWallet />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
