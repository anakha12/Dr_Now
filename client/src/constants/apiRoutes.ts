

export const AdminRoutes = {
  LOGIN: "/login",
  UNVERIFIED_DOCTORS: "/unverified-doctors",
  VERIFY_DOCTOR: (id: string) => `/verify-doctor/${id}`,
  REJECT_DOCTOR: (id: string) => `/reject-doctor/${id}`,
  ALL_DOCTORS: "/doctors",
  TOGGLE_DOCTOR_STATUS: (id: string, action: "block" | "unblock") =>
    `/doctors/${id}/${action}`,
  ALL_USERS: "/users",
  TOGGLE_USER_STATUS: (id: string, action: "block" | "unblock") =>
    `/users/${id}/${action}`,
  ALL_DEPARTMENTS: "/departments",
  TOGGLE_DEPARTMENT_STATUS: (id: string) => `/departments/${id}/status`,
  ADD_DEPARTMENT: "/departments",
  WALLET_SUMMARY: "/wallet-summary",
  PENDING_DOCTORS: "/pending-doctors",
  PAY_DOCTOR: (id: string) => `/pay-doctor/${id}`,
};

export const DoctorRoutes = {
  SEND_OTP: "/send-otp",
  VERIFY_OTP: "/verify-otp",
  LOGIN: "/login",
  PROFILE: "/profile",
  COMPLETE_PROFILE: (id: string) => `/complete-profile/${id}`,

  BOOKINGS: "/bookings",
  BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
  CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,

  AVAILABILITY_RULES: "/availability-rules",
  EDIT_AVAILABILITY_RULE: (dayOfWeek: number) =>
    `/availability-rules/${dayOfWeek}`,
  DELETE_AVAILABILITY_RULE: (dayOfWeek: number) =>
    `/availability-rules/${dayOfWeek}`,

  AVAILABILITY_EXCEPTIONS: "/availability-exceptions",
  DELETE_AVAILABILITY_EXCEPTION: (id: string) =>
    `/availability-exceptions/${id}`,

  DEPARTMENTS: "/departments",
  WALLET_SUMMARY: "/wallet-summary",
};

export const UserRoutes = {
  SEND_OTP: "/send-otp",
  REGISTER: "/register",
  LOGIN: "/login",
  GOOGLE_LOGIN: "/google-login",

  SEND_RESET_OTP: "/send-reset-otp",
  RESET_PASSWORD: "/reset-password",

  GET_ALL_DOCTORS: "/get-all-doctors",
  GET_DOCTOR_BY_ID: (id: string) => `/doctor/${id}`,

  CREATE_STRIPE_SESSION: "/create-checkout-session",
  BOOKED_SLOTS: (doctorId: string, date: string) =>
    `/booked-slots/${doctorId}?date=${date}`,

  PROFILE: "/user/profile",
  BOOKINGS: "/user/bookings",
  BOOKING_DETAILS: (id: string) => `/user/bookings/${id}`,
  CANCEL_BOOKING: (id: string) => `/user/bookings/${id}/cancel`,

  DOCTOR_AVAILABILITY_RULES: (doctorId: string) =>
    `/doctor/${doctorId}/availability-rules`,
  DOCTOR_AVAILABILITY_EXCEPTIONS: (doctorId: string) =>
    `/doctor/${doctorId}/availability-exceptions`,

  DEPARTMENTS: "/departments",
  WALLET: (page: number, limit: number) => `/user/wallet?page=${page}&limit=${limit}`,
  BOOK_WITH_WALLET: "/book-with-wallet",

  FILTER_DOCTORS: "/doctors/filter",
  LOGOUT: "/logout",
};
