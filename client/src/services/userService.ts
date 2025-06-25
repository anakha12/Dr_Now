// src/services/userService.ts
import userAxios from "./userAxiosInstance";

interface Slot {
  from: string;
  to: string;
}

// Protected route
export const getProtectedData = async () => {
  const response = await userAxios.get("/protected");
  return response.data;
};

// Send OTP
export const sendOtp = async (data: {
  name: string;
  email: string;
  password: string;
  isDonner: string;
}) => {
  const response = await userAxios.post("/send-otp", data);
  return response.data;
};

// Register User
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  otp: string; 
  isDonner: string;
}) => {
  const response = await userAxios.post("/register", data);
  return response.data;
};

// Login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await userAxios.post("/login", { email, password });
    return response.data;
  } catch (error: any) {
    const errData = error.response?.data || {};
    if (errData?.error?.includes("verify")) {
      throw { isVerificationRequired: true, email, password };
    }
    throw errData || { message: "Login failed" };
  }
};

// Google Login
export const googleLogin = async (data: {
  name: string;
  email: string;
  uid: string;
}) => {
  const response = await userAxios.post("/google-login", data);
  return response.data;
};

// Forgot Password - Send Reset OTP
export const sendResetOtp = async (email: string) => {
  const response = await userAxios.post("/send-reset-otp", { email });
  return response.data;
};

// Forgot Password - Verify OTP and Reset
export const verifyResetOtp = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await userAxios.post("/reset-password", data);
  return response.data;
};

export const getAllDoctors = async () => {
  const response = await userAxios.get("/get-all-doctors");
  return response.data;
};

export const getDoctorById = async (id: string) => {
  const response = await userAxios.get(`/doctor/${id}`);
  return response.data;
};

export const createStripeSession = async (doctorId: string,userId: string, slot: Slot, fee: number, date: string) => {
  const response = await userAxios.post("/create-checkout-session", {
    doctorId,
    userId,
    slot,
    date,
    fee,
  });

  return response.data;
};

export const getBookedSlots = async (doctorId: string, date: string) => {
  const response = await userAxios.get(`/booked-slots/${doctorId}?date=${date}`);
  return response.data; 
};

export const getUserProfile = async () => {
  const response = await userAxios.get("/user/profile");
  return response.data;
};

export const getUserBookings = async () => {
  const response = await userAxios.get("/user/bookings");
  return response.data; 
};

export const cancelUserBooking = async (bookingId: string) => {
  const response = await userAxios.post(`/user/bookings/${bookingId}/cancel`);
  return response.data;
};

export const getDepartments = async () => {
  const response = await userAxios.get("/departments");
  return response.data.departments;
};

export const getUserWallet = async () => {
  const response = await userAxios.get("/user/wallet");
  return response.data;
};



