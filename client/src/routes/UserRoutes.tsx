import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserRegister from "../features/user/UserRegister";
import UserLogin from "../features/user/UserLogin";
import Dashboard from "../features/user/Dashboard";
import OnlineConsultation from "../features/user/OnlineConsultation";
import VerifyOtp from "../features/user/VerifyOtp";
import ForgotPassword from "../features/user/ForgotPassword";
import UserLayout from "../features/user/UserLayout";
import { useEffect, useState } from "react";
import userAxios from "../services/userAxiosInstance";
import DoctorDetail from "../features/user/DoctorDetail";
import BookAppointment from "../features/user/BookAppointment";
import Success from "../features/user/success";
import UserProfile from "../features/user/UserProfile";
import UserBookings from "../features/user/UserBookings";
import ProfileLayout from "../features/user/ProfileLayout";
import UserNotifications from "../features/user/UserNotifications";



const UserRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const publicPaths = [
      "/user/login",
      "/user/register",
      "/user/verify-otp",
      "/user/forgot-password",
    ];

    if (publicPaths.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }

    userAxios
      .get("/protected", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, [location.pathname]);


  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/verify-otp" element={<VerifyOtp />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/user"
        element={
          isAuthenticated ? <UserLayout /> : <Navigate to="/user/login" />
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="online-consultation" element={<OnlineConsultation />} />
        <Route path="consult/doctor/:id" element={<DoctorDetail />} />
        <Route path="book/:id" element={<BookAppointment />} />
        <Route path="success" element={<Success />} />
        <Route path="notifications" element={<UserNotifications />} />

        {/* ProfileLayout nested routes */}
        <Route path="" element={<ProfileLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<UserBookings />} />
        </Route>

       
      </Route>
    </Routes>
  );
};

export default UserRoutes;
