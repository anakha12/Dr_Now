// src/services/doctorService.ts
import doctorAxios from "./doctorAxiosInstance";

interface Slot {
  from: string;
  to: string;
}


// Send OTP - Step 1
export const sendOtp = async (formData: FormData) => {
  try {
    const response = await doctorAxios.post("/send-otp", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Doctor registration failed" };
  }
};

// Verify OTP - Step 2
export const registerDoctor = async (email: string, otp: string) => {
  try {
    const response = await doctorAxios.post("/verify-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "OTP verification failed" };
  }
};

// Login
export const doctorLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await doctorAxios.post("/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Get Profile
export const getDoctorProfile = async () => {
  try {
    const response = await doctorAxios.get("/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

// Update Profile
export const updateDoctorProfile = async (profileData: any) => {
  try {
    const response = await doctorAxios.put("/profile", profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

// Schedule APIs

export const fetchDoctorAvailability = async (doctorId: string) => {
  try {
    const res = await doctorAxios.get(`/doctors/${doctorId}/availability`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch schedule" };
  }
};

export const addDoctorSchedule = async (
  doctorId: string,
  payload: { date: string; from: string; to: string }
) => {
  try {
    const res = await doctorAxios.post(`/doctors/${doctorId}/availability`, payload);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to add schedule" };
  }
};


export const deleteDoctorSlot = async (
  doctorId: string,
  date: string,
  slot: Slot
) => {
  try {
    const res = await doctorAxios.delete(`/doctors/${doctorId}/availability`, {
      data: { date, from: slot.from, to: slot.to },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to delete slot" };
  }
};

export const getDoctorBookings = async () => {
  const response = await doctorAxios.get("/bookings");
  return response.data;
};


export const cancelDoctorBooking = async (bookingId: string) => {
  const response = await doctorAxios.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};


export const editDoctorSchedule = async (
  doctorId: string,
  payload: {
    date: string;
    from: string;
    to: string;
    oldDate: string;
    oldFrom: string;
    oldTo: string;
  }
) => {
  try {
    const res = await doctorAxios.put(`/doctors/${doctorId}/availability`, payload);
    return res.data;
  } catch (err: any) {
    throw err?.response?.data || { message: "Failed to edit schedule" };
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await doctorAxios.get("/departments"); 
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to load departments" };
  }
};

// Wallet Summary with Pagination
export const getWalletSummary = async (page: number, limit: number) => {
  try {
    const response = await doctorAxios.get("/wallet-summary", {
      params: { page, limit },
    });
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch wallet summary" };
  }
};


  

