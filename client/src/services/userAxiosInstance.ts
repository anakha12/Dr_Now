// src/services/userAxiosInstance.ts
import axios from "axios";
import toast from "react-hot-toast";

const userAxios = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL || "http://localhost:5000/api/users",
  withCredentials: true,
});

userAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await userAxios.get("/refresh-token");
        return userAxios(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default userAxios;
