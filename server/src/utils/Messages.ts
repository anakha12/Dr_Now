
export const Messages = {
  USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
  OTP_SENT: (email: string) => `OTP sent to ${email}`,
  LOGIN_SUCCESSFUL: "Login successful",
  UNAUTHORIZED: "Unauthorized",
  USER_NOT_FOUND: "User not found",
  BOOKING_CANCELLED: "Booking cancelled successfully",
  PASSWORD_RESET_SUCCESSFUL: "Password reset successful",
  RESET_OTP_SENT: "Reset OTP sent to email",
  MISSING_GOOGLE_INFO: "Missing Google login info",
  BOOKING_FAILED: "Failed to cancel booking",
  SLOT_FETCH_FAILED: "Failed to fetch booked slots",
  DOCTOR_NOT_FOUND: "Doctor not found",
  DOCTOR_ID_REQUIRED:" Doctor ID is required",
  INTERNAL_SERVER_ERROR: "Internal server error",
  MISSING_BOOKING_DATA: "Missing booking data",
  MISSING_DOCTOR_AND_DATE:"Doctor ID and date are required",
  FAILED_SENSD_OTP:"Failed to send OTP",
  NOT_ADMIN: "Not an admin",
  DOCTOR_VERIFIED: "Doctor verified successfully",
  DOCTOR_REJECTED: "Doctor rejected successfully",
  DOCTOR_BLOCKED: "Doctor blocked successfully",
  DOCTOR_UNBLOCKED: "Doctor unblocked successfully",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",
  STATUS_UPDATED: (status: string) => `Status updated to ${status}`,
  DOCTOR_PAYOUT_SUCCESS: "Doctor payout successful",
  INVALID_ACTION: "Invalid action",
  CANCEL_ERROR:"CANCELATION FAILED",

  OTP_VERIFIED: "OTP verified successfully",
  SLOT_REMOVED: "Slot removed successfully",
  PROFILE_COMPLETED: "Profile completed",
  MISSING_FIELDS: "Missing required fields",

  TOKEN_REFRESHED:"Token refreshed successfully",
  INVALID_OR_EXPIRED_TOKEN:"Invalid or expired token",
  TOKEN_MISSING:"token missing",
  FORBIDDEN_ERROR: "Forbidden",
  DEPARTMENT_ALREADY_EXISTS: "Department name already exists",

  RULE_ADDED: "Availability rule added successfully",
  RULE_ALREADY_EXISTS: (day: number) => `Rule for day ${day} already exists`,

  BOOKING_CANCELLED_BY_DOCTOR: "Doctor cancelled appointment",
  REFUND_PROCESSED: "Refund processed successfully",

  EXCEPTION_DELETED: "Availability exception deleted successfully",
  RULE_DELETED: "Availability rule deleted successfully",
  RULE_UPDATED: "Availability rule updated successfully",

  PROFILE_CONFIRMATION_REQUIRED: "confirmation_required",

  WALLET_BOOKING_SUCCESS: "Appointment booked using wallet",
  LOGOUT_SUCCESSFUL: "Logout successful",
  PASSWORD_REQUIRED: "Password is required",
  USER_VERIFIED_ALREADY:"User already verified",

  STRIPE_KEY_MISSING: "STRIPE_SECRET_KEY is not set",

};

export const ErrorMessages = {
  USER_NOT_FOUND: "User not found",
  EMAIL_NOT_VERIFIED: "Please verify your email/OTP before logging in",
  INVALID_CREDENTIALS: "Invalid credentials",
  NOT_AN_ADMIN: "Not an admin",
  NO_PENDING_PAYOUTS: "No completed bookings with pending payout for this doctor",
  DOCTOR_NOT_FOUND: "Doctor not found",

  BOOKING_NOT_FOUND: "Booking not found",
  UNAUTHORIZED_CANCELLATION: "You are not authorized to cancel this booking",
  NON_UPCOMING_BOOKING: "Only upcoming bookings can be cancelled",
  CANNOT_CANCEL_PAST: "Cannot cancel past appointments",

  EXCEPTION_NOT_FOUND: "Availability exception not found",

  RULE_NOT_FOUND: "Availability rule not found for this day",
  DOCTOR_REJECTED: "This doctor is rejected",
  DOCTOR_NOT_VERIFIED: "Doctor is not verified",

  INVALID_PASSWORD: "Incorrect password",
  BOOKING_ID_AND_DOCTOR_ID_REQUIRED: "Booking ID and Doctor ID are required",
  BOOKING_NOT_FOUND_OR_UNAUTHORIZED: "Booking not found or unauthorized",

  SLOT_TIME_REQUIRED: "Date and slot times are required",
  NO_AVAILABILITY_FOR_DATE: "No availability found for this date",
  SLOT_NOT_FOUND: "Slot does not exist or has already been removed",
  SLOT_ALREADY_BOOKED: "Cannot remove: slot is already booked",
  DOCTOR_ALREADY_EXISTS: "Doctor already exists with this email",

  PROFILE_UPDATE_BLOCKED: "You cannot update your profile while bookings exist.",
  PROFILE_UPDATE_FAILED: "Failed to update profile",

  OTP_NOT_FOUND: "OTP expired or not  found",
  INVALID_OTP: "Invalid OTP",

  METADATA_MISSING: "Missing metadata in session",
  FEE_INVALID: "Invalid fee in session metadata",

  INSUFFICIENT_WALLET_BALANCE: "Insufficient wallet balance",

}; 

export const RedisMessages = {
  CONNECTED: "Redis client connected successfully",
  ERROR: (err: Error) => `Redis Client Error: ${err}`,
  DISCONNECTED: "Redis client disconnected",
  SET_SUCCESS: (key: string) => `Key '${key}' set successfully`,
  GET_SUCCESS: (key: string) => `Key '${key}' retrieved successfully`,
  KEY_NOT_FOUND: (key: string) => `Key '${key}' not found in Redis`,
};

export const StripeWebhookMessages = {
  WEBHOOK_ERROR: (err: Error) => `Webhook Error: ${err.message}`,
  FAILED_TO_SAVE_BOOKING: "Failed to save booking",
  RECEIVED_NON_HANDLED_EVENT: (eventType: string) => `Received non-handled event type: ${eventType}`,
  WEBHOOK_RECEIVED: { received: true },
  UNHANDLED_EVENT: (eventType: string) => `Received unhandled Stripe event type: ${eventType}`,
};

export const AppMessages = {
  MONGODB_CONNECTED: "MongoDB connected successfully",
  MONGODB_ERROR: (err: Error) => `MongoDB error: ${err.message}`,
  SERVER_RUNNING: (port: number) => `Server running on port ${port}`,
};

