// src/services/doctorAxiosInstance.ts
import axios from "axios";
import toast from "react-hot-toast";

const doctorAxios = axios.create({
  baseURL: import.meta.env.VITE_DOCTOR_API_URL || "http://localhost:5000/api/doctor",
  withCredentials: true,
});

doctorAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await doctorAxios.get("/refresh-token");
        return doctorAxios(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/doctor/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default doctorAxios;
