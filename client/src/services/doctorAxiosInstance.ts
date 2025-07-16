import { createAxiosInstance } from "./createAxiosInstance";

const doctorAxios = createAxiosInstance({
  baseURL: import.meta.env.VITE_DOCTOR_API_URL || "http://localhost:5000/api/doctor",
  refreshEndpoint: "/refresh-token",
  redirectPath: "/doctor/login",
});

export default doctorAxios;
