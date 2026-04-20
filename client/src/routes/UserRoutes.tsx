import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

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
import UpdateProfile from "../features/user/UpdateProfile";
import ChatPage from "../features/user/ChatPage";
import UserPrescriptionView from "../features/user/UserPrescriptionView";
import NotFound from "../features/NotFound";
import About from "../features/user/About";
import Contact from "../features/user/Contact";

// Guard for routes that require login
const PrivateRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) => {
  const location = useLocation();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" state={{ from: location }} replace />;
};

const UserRoutes = () => {
  const userAuth = useSelector((state: RootState) => state.userAuth);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isRehydrated = (userAuth as any)._persist?.rehydrated ?? true;
  const { isAuthenticated } = userAuth;

  // Wait for redux-persist to finish rehydrating before making redirect decisions
  if (!isRehydrated) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <UserLogin />
          )
        }
      />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/success" element={<Success />} />

      <Route
        path="/"
        element={<UserLayout />}
      >
        <Route index element={<Dashboard />} />
        <Route path="online-consultation" element={<OnlineConsultation />} />
        <Route path="doctors" element={<DoctorListing />} />
        <Route path="consult/doctor/:id" element={<DoctorDetail />} />
        <Route path="book/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><BookAppointment /></PrivateRoute>} />
        <Route path="notifications" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserNotifications /></PrivateRoute>} />
        <Route path="bookings/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><BookingDetails /></PrivateRoute>} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        <Route element={<PrivateRoute isAuthenticated={isAuthenticated}><ProfileLayout /></PrivateRoute>}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="wallet" element={<UserWallet />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="chat/:bookingId" element={<ChatPage />} />
        </Route>

        <Route path="prescription" element={<PrivateRoute isAuthenticated={isAuthenticated}><UserPrescriptionView /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;