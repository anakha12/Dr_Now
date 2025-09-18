import { doctorAxios } from "./axiosInstances"
import type { DoctorProfile } from "../types/doctorProfile";
import type { Booking } from "../types/booking";
import type { AvailabilityException } from "../types/availabilityException";
import type { AvailabilityRule } from "../types/availabilityRule";
import type { WalletSummary } from "../types/walletSummary";
import { handleError } from "../utils/errorHandler";
import type { Department } from "../types/department";


export const sendOtp = async (formData: FormData): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.post("/send-otp", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, "Doctor registration failed");
  }
};

export const registerDoctor = async (email: string, otp: string): Promise<{ token: string }> => {
  try {
    const response = await doctorAxios.post("/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw handleError(error, "OTP verification failed");
  }
};

export const doctorLogin = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await doctorAxios.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw handleError(error, "Login failed");
  }
};


export const getDoctorProfile = async (): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.get("/profile");
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch profile");
  }
};

export const updateDoctorProfile = async (profileData: Partial<DoctorProfile>): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.put("/profile", profileData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to update profile");
  }
};

export const completeDoctorProfile = async (
  doctorId: string,
  profileData: Omit<DoctorProfile, "_id" | "email">
): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.put(`/complete-profile/${doctorId}`, profileData);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to complete profile");
  }
};


export const getDoctorBookings = async (page: number, limit: number): Promise<Booking[]> => {
  try {
    const response = await doctorAxios.get("/bookings", { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch bookings");
  }
};

export const getDoctorBookingDetails = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await doctorAxios.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch booking details");
  }
};

export const cancelDoctorBooking = async (bookingId: string, reason: string): Promise<Booking> => {
  try {
    const response = await doctorAxios.put(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to cancel booking");
  }
};


export const fetchDoctorAvailabilityRules = async (): Promise<AvailabilityRule[]> => {
  try {
    const response = await doctorAxios.get("/availability-rules");
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch availability rules");
  }
};

export const addDoctorAvailabilityRule = async (payload: AvailabilityRule): Promise<AvailabilityRule> => {
  try {
    const response = await doctorAxios.post("/availability-rules", payload);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to add availability rule");
  }
};

export const editDoctorAvailabilityRule = async (
  dayOfWeek: number,
  payload: Partial<Omit<AvailabilityRule, "dayOfWeek">>
): Promise<AvailabilityRule> => {
  try {
    const response = await doctorAxios.put(`/availability-rules/${dayOfWeek}`, payload);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to edit availability rule");
  }
};

export const deleteDoctorAvailabilityRule = async (dayOfWeek: number): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.delete(`/availability-rules/${dayOfWeek}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to delete availability rule");
  }
};


export const fetchDoctorAvailabilityExceptions = async (): Promise<AvailabilityException[]> => {
  try {
    const response = await doctorAxios.get("/availability-exceptions");
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch availability exceptions");
  }
};


export const addDoctorAvailabilityException = async (
  exception: Partial<Omit<AvailabilityException, "_id">>
): Promise<AvailabilityException> => {
  try {
    const response = await doctorAxios.post("/availability-exceptions", exception);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to add availability exception");
  }
};

export const deleteDoctorAvailabilityException = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.delete(`/availability-exceptions/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to delete availability exception");
  }
};


export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await doctorAxios.get("/departments");
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to load departments");
  }
};


export const getWalletSummary = async (page: number, limit: number): Promise<WalletSummary[]> => {
  try {
    const response = await doctorAxios.get("/wallet-summary", { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch wallet summary");
  }
};
