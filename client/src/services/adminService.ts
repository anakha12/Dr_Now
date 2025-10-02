

import { adminAxios } from "./axiosInstances";
import type { DepartmentResponse } from "../types/department";
import { Messages } from "../constants/messages";
import { handleError } from "../utils/errorHandler";
import { AdminRoutes } from "../constants/apiRoutes";
import logger from "../utils/logger";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await adminAxios.post(
      AdminRoutes.LOGIN,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AUTH.LOGIN_FAILED);
  }
};

export const getUnverifiedDoctors = async (page = 1, limit = 5) => {
  try {
    const response = await adminAxios.get(
      `${AdminRoutes.UNVERIFIED_DOCTORS}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.NO_RESULTS);
  }
};

export const verifyDoctorById = async (doctorId: string) => {
  try {
    const response = await adminAxios.post(AdminRoutes.VERIFY_DOCTOR(doctorId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.VERIFY_FAILED);
  }
};

export const rejectDoctorById = async (doctorId: string, reason: string) => {
  try {
    const response = await adminAxios.post(AdminRoutes.REJECT_DOCTOR(doctorId), { reason });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.REJECT_FAILED);
  }
};

export const getAllDoctors = async (page = 1, limit = 5, searchQuery = "") => {
  try {
    const response = await adminAxios.get(AdminRoutes.ALL_DOCTORS, {
      params: { page, limit, search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.FETCH_FAILED);
  }
};

export const toggleDoctorBlockStatus = async (
  doctorId: string,
  action: "block" | "unblock"
) => {
  try {
    const response = await adminAxios.patch(
      AdminRoutes.TOGGLE_DOCTOR_STATUS(doctorId, action)
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.ACTION_FAILED);
  }
};

export const getAllUsers = async (page = 1, limit = 5, searchQuery = "") => {
  try {
    const response = await adminAxios.get(AdminRoutes.ALL_USERS, {
      params: { page, limit, search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.USER.FETCH_FAILED);
  }
};

export const toggleUserBlockStatus = async (
  userId: string,
  action: "block" | "unblock"
) => {
  try {
    const response = await adminAxios.patch(
      AdminRoutes.TOGGLE_USER_STATUS(userId, action)
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.USER.ACTION_FAILED);
  }
};

export const getAllDepartments = async (
  page = 1,
  limit = 5,
  searchQuery = ""
): Promise<DepartmentResponse> => {
  try {
    const response = await adminAxios.get(AdminRoutes.ALL_DEPARTMENTS, {
      params: { page, limit, search: searchQuery },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
  }
};

export const toggleDepartmentStatus = async (
  departmentId: string,
  newStatus: "Listed" | "Unlisted"
) => {
  try {
    const response = await adminAxios.patch(
      AdminRoutes.TOGGLE_DEPARTMENT_STATUS(departmentId),
      { status: newStatus }
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
  }
};

export const addDepartment = async (data: {
  Departmentname: string;
  Description: string;
}) => {
  try {
    const response = await adminAxios.post(AdminRoutes.ADD_DEPARTMENT, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      logger.log("Validation errors:", error.response.data.errors);
      throw error.response.data.errors;
    }
    throw handleError(error, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
  }
};

export const getWalletSummary = async () => {
  try {
    const response = await adminAxios.get(AdminRoutes.WALLET_SUMMARY);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.FETCH_WALLET_FAILED);
  }
};

export const getPendingDoctors = async (page = 1, limit = 5) => {
  try {
    const response = await adminAxios.get(
      `${AdminRoutes.PENDING_DOCTORS}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.NO_RESULTS);
  }
};

export const payoutDoctor = async (doctorId: string) => {
  try {
    const response = await adminAxios.post(AdminRoutes.PAY_DOCTOR(doctorId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.PAYOUT_FAILED);
  }
};
