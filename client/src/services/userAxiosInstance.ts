import { createAxiosInstance } from "./createAxiosInstance";

const userAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_USER_API_URL || "http://localhost:5000/api/users",
  refreshEndpoint: "/refresh-token",
  redirectPath: "/login",
});

export default userAxios;
