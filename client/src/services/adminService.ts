// src/services/adminService.ts
import adminAxios from "./adminAxiosInstance"; 


export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await adminAxios.post(
      "/login",
      { email, password },
      { withCredentials: true } 
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Admin login failed";
    throw new Error(message);
  }
};


export const getUnverifiedDoctors = async () => {
  try {
    const response = await adminAxios.get("/unverified-doctors");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch unverified doctors";
    throw new Error(message);
  }
};

export const verifyDoctorById = async (doctorId: string) => {
  try {
    const response = await adminAxios.post(`/verify-doctor/${doctorId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to verify doctor";
    throw new Error(message);
  }
};

export const rejectDoctorById = async (doctorId: string) => {
  try {
    const response = await adminAxios.post(`/reject-doctor/${doctorId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to reject doctor";
    throw new Error(message);
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await adminAxios.get("/doctors");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch doctors";
    throw new Error(message);
  }
};

export const toggleDoctorBlockStatus = async (doctorId: string, action: "block" | "unblock") => {
  try {
    const response = await adminAxios.patch(`/doctors/${doctorId}/${action}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update doctor status";
    throw new Error(message);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await adminAxios.get("/users");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch users";
    throw new Error(message);
  }
};

export const toggleUserBlockStatus = async (userId: string, action: "block" | "unblock") => {
  try {
    const response = await adminAxios.patch(`/users/${userId}/${action}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update user status";
    throw new Error(message);
  }
};

export const getAllDepartments = async (page: number, limit: number = 5) => {
  try {
    const response = await adminAxios.get(`/departments?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch departments";
    throw new Error(message);
  }
};

export const toggleDepartmentStatus = async (departmentId: string, newStatus: "Listed" | "Unlisted") => {
  try {
    const response = await adminAxios.patch(`/departments/${departmentId}/status`, { status: newStatus });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to update department status";
    throw new Error(message);
  }
};

export const addDepartment = async (data: {
  Departmentname: string;
  Description: string;
}) => {
  try {
    const response = await adminAxios.post("/departments", data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to add department";
    throw new Error(message);
  }
};


export const getWalletSummary = async () => {
  try {
    const response = await adminAxios.get("/wallet-summary");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch wallet summary";
    throw new Error(message);
  }
};


export const getPendingDoctors = async () => {
  try {
    const response = await adminAxios.get("/pending-doctors");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch pending doctors";
    throw new Error(message);
  }
};


export const payoutDoctor = async (doctorId: string) => {
  try {
    const response = await adminAxios.post(`/pay-doctor/${doctorId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Doctor payout failed";
    throw new Error(message);
  }
};

