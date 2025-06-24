// src/services/adminAxiosInstance.ts
import axios from "axios";
import toast from "react-hot-toast";

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5000/api/admin",
  withCredentials: true,
});

adminAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Avoid redirecting while checking auth status
    if (originalRequest.url?.includes("/protected")) {
      return Promise.reject(err); // just reject, no redirect
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await adminAxios.get("/refresh-token");
        return adminAxios(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }   

    return Promise.reject(err);
  }
);


export default adminAxios;
