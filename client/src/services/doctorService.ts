
import doctorAxios from "./doctorAxiosInstance";

interface Slot {
  from: string;
  to: string;
}



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


export const registerDoctor = async (email: string, otp: string) => {
  try {
    const response = await doctorAxios.post("/verify-otp", { email, otp });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "OTP verification failed" };
  }
};


export const doctorLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await doctorAxios.post("/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};


export const getDoctorProfile = async () => {
  try {
    const response = await doctorAxios.get("/profile");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};


export const updateDoctorProfile = async (profileData: any) => {
  try {
    const response = await doctorAxios.put("/profile", profileData);
    return response.data;
  } catch (error: any) {
    const backendError = error?.response?.data?.error;
    throw new Error(backendError || "Failed to update profile");
  }
};



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

export const getDoctorBookings = async (page: number, limit: number) => {
  try {
    const response = await doctorAxios.get("/bookings", {
      params: { page, limit },
    });
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch bookings" };
  }
};



export const cancelDoctorBooking = async (bookingId: string, reason: string) => {
  const response = await doctorAxios.put(`/bookings/${bookingId}/cancel`,{reason});
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


export const completeDoctorProfile = async (
  doctorId: string,
  profileData: {
    bio: string;
    education: { degree: string; institution: string; year: string }[];
    awards: string[];
    experience: { hospital: string; role: string; years: string }[];
    affiliatedHospitals: string[];
  }
) => {
  try {
    const response = await doctorAxios.put(`/complete-profile/${doctorId}`, profileData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to complete profile" };
  }
};


export const getDoctorBookingDetails = async (bookingId: string) => {
  const response = await doctorAxios.get(`/bookings/${bookingId}`);
  return response.data;
};




  

