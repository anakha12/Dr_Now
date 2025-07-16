import { createAxiosInstance } from "./createAxiosInstance";

const adminAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5000/api/admin",
  refreshEndpoint: "/refresh-token",
  redirectPath: "/admin/login",
  skipInterceptorUrls: ["/protected"],
});

export default adminAxios;
