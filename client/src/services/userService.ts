
import { userAxios } from "./axiosInstances";
import type { Slot } from "../types/slot";
import { Messages } from "../constants/messages";
import { handleError } from "../utils/errorHandler";
import { UserRoutes } from "../constants/apiRoutes";


export const sendOtp = async (data: {
  name: string;
  email: string;
  password: string;
  isDonner: string;
}) => {
  try {
    const response = await userAxios.post(UserRoutes.SEND_OTP, data);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.REGISTRATION.OTP_FAILED);
  }
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  otp: string;
  isDonner: string;
}) => {
  try {
    const response = await userAxios.post(UserRoutes.REGISTER, data);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.REGISTRATION.REGISTRATION_FAILED);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await userAxios.post(UserRoutes.LOGIN, { email, password });
    return response.data;
  } catch (error: any) {
    const errData = error.response?.data || {};
    if (errData?.error?.includes("verify")) {
      throw { isVerificationRequired: true, email, password };
    }
    throw handleError(error, Messages.AUTH.LOGIN_FAILED);
  }
};

export const googleLogin = async (data: { name: string; email: string; uid: string }) => {
  try {
    const response = await userAxios.post(UserRoutes.GOOGLE_LOGIN, data);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AUTH.LOGIN_FAILED);
  }
};


export const sendResetOtp = async (email: string) => {
  try {
    const response = await userAxios.post(UserRoutes.SEND_RESET_OTP, { email });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.FORGOT_PASSWORD.OTP_FAILED);
  }
};

export const verifyResetOtp = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  try {
    const response = await userAxios.post(UserRoutes.RESET_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.FORGOT_PASSWORD.RESET_FAILED);
  }
};

export const getAllDoctors = async () => {
  try {
    const response = await userAxios.get(UserRoutes.GET_ALL_DOCTORS);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.FETCH_FAILED);
  }
};

export const getDoctorById = async (id: string) => {
  try {
    const response = await userAxios.get(UserRoutes.GET_DOCTOR_BY_ID(id));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.FETCH_FAILED);
  }
};


export const createStripeSession = async (
  doctorId: string,
  userId: string,
  slot: Slot,
  fee: number,
  date: string
) => {
  try {
    const response = await userAxios.post(UserRoutes.CREATE_STRIPE_SESSION, {
      doctorId,
      userId,
      slot,
      date,
      fee,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.PAYMENT.STRIPE_INIT_FAILED);
  }
};

export const getBookedSlots = async (doctorId: string, date: string) => {
  try {
    const response = await userAxios.get(UserRoutes.BOOKED_SLOTS(doctorId, date));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.APPOINTMENTS.FETCH_FAILED);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await userAxios.get(UserRoutes.PROFILE);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.USER.FETCH_FAILED);
  }
};

export const getDoctorAvailabilityRules = async (doctorId: string) => {
  try {
    const response = await userAxios.get(UserRoutes.DOCTOR_AVAILABILITY_RULES(doctorId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_RULES_FAILED);
  }
};

export const getDoctorAvailabilityExceptions = async (doctorId: string) => {
  try {
    const response = await userAxios.get(UserRoutes.DOCTOR_AVAILABILITY_EXCEPTIONS(doctorId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_EXCEPTIONS_FAILED);
  }
};

export const getUserBookings = async (page = 1, limit = 4) => {
  try {
    const response = await userAxios.get(UserRoutes.BOOKINGS, { params: { page, limit } });
    console.log(response)
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.APPOINTMENTS.FETCH_FAILED);
  }
};

export const logoutUser = async () => {
  try {
    const response = await userAxios.post(UserRoutes.LOGOUT, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.AUTH.LOGIN_FAILED);
  }
};

export const cancelUserBooking = async (bookingId: string, reason: string) => {
  try {
    const response = await userAxios.post(UserRoutes.CANCEL_BOOKING(bookingId), { reason });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.APPOINTMENTS.CANCEL_FAILED);
  }
};

export const getDepartments = async () => {
  try {
    const response = await userAxios.get(UserRoutes.DEPARTMENTS);
    return response.data.departments;
  } catch (error) {
    throw handleError(error, Messages.AVAILABILITY.FETCH_DEPARTMENTS_FAILED);
  }
};

export const getUserWallet = async (page: number, limit: number) => {
  try {
    const response = await userAxios.get(UserRoutes.WALLET(page, limit));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.WALLET.FETCH_FAILED);
  }
};

export const bookAppointmentWithWallet = async (
  doctorId: string,
  userId: string,
  slot: Slot,
  amount: number,
  date: string
) => {
  try {
    const response = await userAxios.post(UserRoutes.BOOK_WITH_WALLET, {
      doctorId,
      userId,
      slot,
      amount,
      date,
    });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.PAYMENT.BOOKING_FAILED);
  }
};

export const getFilteredDoctors = async (filters: {
  search?: string;
  specialization?: string;
  maxFee?: number;
  gender?: string;
  page?: number;
}) => {
  try {
    const response = await userAxios.get(UserRoutes.FILTER_DOCTORS, { params: filters });
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.LISTING.FETCH_ERROR);
  }
};

export const getBookingDetails = async (bookingId: string | undefined) => {
  if (!bookingId) throw new Error(Messages.DOCTOR.BOOKING_DETAILS.BOOKING_ID_REQUIRED);
  try {
    const response = await userAxios.get(UserRoutes.BOOKING_DETAILS(bookingId));
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.DOCTOR.BOOKING_DETAILS.FETCH_FAILED);
  }
};

export const updateUserProfile = async (data: FormData) => {
  try {
    const response = await userAxios.put(UserRoutes.UPDATE_PROFILE, data);
    return response.data;
  } catch (error) {
    throw handleError(error, Messages.USER.UPDATE_FAILED);
  }
};

