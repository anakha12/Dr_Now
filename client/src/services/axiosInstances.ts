import { createAxiosInstance } from "./api";

// Admin
export const adminAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
  refreshEndpoint: "/refresh-token",
  redirectPath: "/admin/login",
  skipInterceptorUrls: ["/protected"],
});

// User 
export const userAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_USER_API_URL,
  refreshEndpoint: "/refresh-token",
  redirectPath: "/user/login",
  skipInterceptorUrls: ["/protected"],
});
  
// Doctor 
export const doctorAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_DOCTOR_API_URL,
  refreshEndpoint: "/refresh-token",
  redirectPath: "/doctor/login",
  skipInterceptorUrls: ["/protected"],
});
 