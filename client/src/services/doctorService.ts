// src/services/doctorService.ts

import { doctorAxios } from "./axiosInstances";
import type { DoctorProfile } from "../types/doctorProfile";
import type { Booking } from "../types/booking";
import type { AvailabilityException } from "../types/availabilityException";
import type { AvailabilityRule } from "../types/availabilityRule";
import type { WalletSummary } from "../types/walletSummary";
import type { Department } from "../types/department";
import { handleError } from "../utils/errorHandler";
import { Messages } from "../constants/messages";
import { DoctorRoutes } from "../constants/apiRoutes";
import type { DoctorLoginResponse } from "../types/auth";
import type { DoctorBookingsResponse } from "../types/doctorBookingsResponse";

export const sendOtp = async (formData: FormData): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.post(DoctorRoutes.SEND_OTP, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.REGISTRATION.OTP_FAILED);
  }
};

export const registerDoctor = async (email: string, otp: string): Promise<{ token: string }> => {
  try {
    const response = await doctorAxios.post(DoctorRoutes.VERIFY_OTP, { email, otp });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.REGISTRATION.INVALID_OTP);
  }
};

export const doctorLogin = async (email: string, password: string): Promise<DoctorLoginResponse> => {
  try {
    const response = await doctorAxios.post(DoctorRoutes.LOGIN, { email, password });
    console.log(response)
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AUTH.LOGIN_FAILED);
  }
};


export const getDoctorProfile = async (): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.PROFILE);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR_PROFILE.ERROR_FETCH);
  }
};


export const updateDoctorProfile = async (profileData: Partial<DoctorProfile>): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.put(DoctorRoutes.PROFILE, profileData);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.PROFILE_UPDATE_FAILED);
  }
};


export const completeDoctorProfile = async (
  doctorId: string,
  profileData: Omit<DoctorProfile, "_id" | "email">
): Promise<DoctorProfile> => {
  try {
    const response = await doctorAxios.put(DoctorRoutes.COMPLETE_PROFILE(doctorId), profileData);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.PROFILE_UPDATE_FAILED);
  }
};

export const getDoctorBookings = async (
  page: number,
  limit: number
): Promise<DoctorBookingsResponse> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.BOOKINGS, { params: { page, limit } });
    return response.data; // response.data is { bookings: [...], totalPages: n }
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.APPOINTMENTS.FETCH_FAILED);
  }
};


export const getDoctorBookingDetails = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.BOOKING_DETAILS(bookingId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.BOOKING_DETAILS.FETCH_FAILED);
  }
};


export const cancelDoctorBooking = async (bookingId: string, reason: string): Promise<Booking> => {
  try {
    const response = await doctorAxios.put(DoctorRoutes.CANCEL_BOOKING(bookingId), { reason });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.APPOINTMENTS.CANCEL_FAILED);
  }
};


export const fetchDoctorAvailabilityRules = async (): Promise<AvailabilityRule[]> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.AVAILABILITY_RULES);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_RULES_FAILED);
  }
};

export const addDoctorAvailabilityRule = async (payload: AvailabilityRule): Promise<AvailabilityRule> => {
  try {
    const response = await doctorAxios.post(DoctorRoutes.AVAILABILITY_RULES, payload);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.ADD_RULE_FAILED);
  }
};

export const editDoctorAvailabilityRule = async (
  dayOfWeek: number,
  payload: Partial<Omit<AvailabilityRule, "dayOfWeek">>
): Promise<AvailabilityRule> => {
  try {
    const response = await doctorAxios.put(DoctorRoutes.EDIT_AVAILABILITY_RULE(dayOfWeek), payload);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.UPDATE_RULE_FAILED);
  }
};

export const deleteDoctorAvailabilityRule = async (dayOfWeek: number): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.delete(DoctorRoutes.DELETE_AVAILABILITY_RULE(dayOfWeek));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.DELETE_RULE_FAILED);
  }
};


export const fetchDoctorAvailabilityExceptions = async (): Promise<AvailabilityException[]> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.AVAILABILITY_EXCEPTIONS);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_EXCEPTIONS_FAILED);
  }
};

export const addDoctorAvailabilityException = async (
  exception: Partial<Omit<AvailabilityException, "_id">>
): Promise<AvailabilityException> => {
  try {
    const response = await doctorAxios.post(DoctorRoutes.AVAILABILITY_EXCEPTIONS, exception);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.ADD_EXCEPTION_FAILED);
  }
};

export const deleteDoctorAvailabilityException = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await doctorAxios.delete(DoctorRoutes.DELETE_AVAILABILITY_EXCEPTION(id));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.DELETE_EXCEPTION_FAILED);
  }
};


export const getAllDepartments = async (): Promise<Department[]> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.DEPARTMENTS);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
  }
};

export const getWalletSummary = async (page: number, limit: number): Promise<WalletSummary[]> => {
  try {
    const response = await doctorAxios.get(DoctorRoutes.WALLET_SUMMARY, { params: { page, limit } });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.WALLET.FETCH_FAILED);
  }
};
