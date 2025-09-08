
import { adminAxios } from "./axiosInstances"; 
import type { DepartmentResponse } from "../types/department";

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


export const getUnverifiedDoctors = async (page = 1, limit = 5) => {
  try {
    const response = await adminAxios.get(`/unverified-doctors?page=${page}&limit=${limit}`);
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

export const getAllDoctors = async (page: number = 1, limit: number = 5, searchQuery: string="") => {
  try {
    const response = await adminAxios.get("/doctors", {
      params: { page, limit, search: searchQuery },
    });
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

export const getAllUsers = async (
  page: number,
  limit: number = 5,
  searchQuery: string = ""
) => {
  try {
    const response = await adminAxios.get(`/users`, {
      params: { page, limit, search: searchQuery }, 
    });
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

export const getAllDepartments = async (page: number, limit: number = 5, searchQuery: string=""):Promise<DepartmentResponse> => {
  try {
    const response = await adminAxios.get(`/departments?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`);
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
    
    if (error.response?.data?.errors) {
      console.log("Validation errors:", error.response.data.errors);
      throw error.response.data.errors; 
    }
    const message = error.response?.data?.message;
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


export const getPendingDoctors = async (page = 1, limit = 5) => {
  try {
    const response = await adminAxios.get(`/pending-doctors?page=${page}&limit=${limit}`);
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

