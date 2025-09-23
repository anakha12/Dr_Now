export const Messages = {
  AUTH: {
    LOGOUT_SUCCESS: "Logged out successfully!",
    LOGIN_SUCCESS: "Login successful! Redirecting...",
    LOGIN_ACCESS_DENIED: "Access denied: You are not an admin.",
    LOGIN_FAILED: "Login failed. Please check your credentials.",
  },
  PAYMENT: {
    STRIPE_INIT_FAILED: "Stripe initialization failed",
    BOOKING_FAILED: "Booking failed",
  },
  DOCTOR_PROFILE: {
    LOADING: "Loading doctor details...",
    NO_BIO: "No bio available.",
    BOOK_APPOINTMENT: "Book Appointment",
    ERROR_FETCH: "Failed to load doctor details.",
  },
  DOCTOR: {
    FETCH_FAILED: "Failed to fetch doctors.",
    BLOCK_SUCCESS: "Doctor blocked successfully.",
    UNBLOCK_SUCCESS: "Doctor unblocked successfully.",
    ACTION_FAILED: "Doctor action failed. Please try again.",
    VERIFY_SUCCESS: "Doctor verified successfully.",
    REJECT_SUCCESS: "Doctor rejected successfully.",
    VERIFY_FAILED: "Failed to verify doctor.",
    REJECT_FAILED: "Failed to reject doctor.",
    NO_RESULTS: "No doctors to verify.",
    LOADING: "Loading doctors...",
    LOGIN_BUTTON: "Login",
    LOGIN_HEADING: "Doctor Login",

    PROFILE_UPDATE_SUCCESS: "Profile updated successfully",
    PROFILE_UPDATE_WITH_CONFIRM: "Profile updated with confirmation",
    PROFILE_UPDATE_FAILED: "Failed to update profile",

    PAYOUT_SUCCESS: "Payout successful!",
    PAYOUT_FAILED: "Payout failed.",
    PAYOUT_CANCELLED: "Payout cancelled.",
    FETCH_WALLET_FAILED: "Failed to load data.",

    APPOINTMENTS: {
      FETCH_FAILED: "Failed to load appointments",
      SELECT_SLOT: "Please select a date and slot.",
      SELECT_PAST_DATE: "Cannot select past dates.",
      BOOKING_SUCCESS: "Appointment booked successfully!",
      CONFIRM_CANCEL: "Are you sure you want to cancel this appointment?",
      PROMPT_CANCEL_REASON: "Please enter the reason for cancellation",
      PROMPT_CANCEL_PLACEHOLDER: "e.g., Emergency",
      CANCEL_REASON_REQUIRED: "Cancellation reason is required",
      CANCEL_SUCCESS: "Appointment cancelled",
      CANCEL_FAILED: "Cancellation failed",
      NO_BOOKINGS: "No bookings found.",
    },

    REGISTRATION: {
      HEADER: "Doctor Registration",
      ENTER_OTP: "Enter OTP",
      SEND_OTP: "Send OTP",
      VERIFY_REGISTER: "Verify & Register",
      FILL_ALL_FIELDS: "Please fill in all fields and upload documents.",
      INVALID_EMAIL: "Invalid email.",
      INVALID_PHONE: "Invalid phone number.",
      INVALID_NUMBERS: "Check age, experience, and consultation fee.",
      OTP_SENT: "OTP sent. Please check your email.",
      OTP_FAILED: "Failed to send OTP.",
      REGISTRATION_SUCCESS: "Registration successful!",
      INVALID_OTP: "Invalid OTP. Try again.",
      DEPARTMENTS_FETCH_FAILED: "Unable to load specializations",
      REGISTRATION_FAILED: "Registration Failed"
    },
    LISTING: {
      LOADING: "Loading doctors...",
      FETCH_ERROR: "Failed to fetch doctors. Please try again later.",
      NO_DOCTORS: "No doctors found matching your criteria.",
    },

    BOOKING_DETAILS: {
      FETCH_FAILED: "Failed to fetch booking details",
      LOADING: "Loading booking details...",
      NOT_FOUND: "Booking not found.",
      HEADING: "Appointment Summary",
      BOOKING_ID_REQUIRED: "Booking ID is required",
      LABELS: {
        BOOKING_ID: "Booking ID",
        DOCTOR_NAME: "Doctor Name",
        PATIENT_NAME: "Patient Name",
        DEPARTMENT: "Department",
        DATE: "Date",
        TIME_SLOT: "Time Slot",
        STATUS: "Status",
        TOTAL_AMOUNT: "Total Amount",
        DOCTOR_EARNING: "Doctor Earning",
        COMMISSION_AMOUNT: "Commission Amount",
        PAYOUT_STATUS: "Payout Status",
        BOOKED_ON: "Booked On",
        CANCELLATION_REASON: "Cancellation Reason",
         PAYMENT_STATUS: "Payment Status",
      },
      NA: "N/A",
      PENDING: "Pending",
      BACK_BUTTON: "Back to Appointments",
    },
  },

  USER: {
    FETCH_FAILED: "Failed to load patients.",
    BLOCK_SUCCESS: "User blocked successfully.",
    UNBLOCK_SUCCESS: "User unblocked successfully.",
    ACTION_FAILED: "User action failed. Please try again.",
    NO_RESULTS: "No patients found.",
  },

  COMMON: {
    CONFIRM: "Are you sure?",
    CANCEL: "Cancel",
    CONFIRM_BUTTON: "Confirm",
    SUBMIT: "Submit",
    INPUT_PLACEHOLDER: "Enter value",
  },

  AVAILABILITY: {
    FETCH_RULES_FAILED: "Failed to load availability rules",
    FETCH_EXCEPTIONS_FAILED: "Failed to load availability exceptions",
    FETCH_DEPARTMENTS_FAILED: "Failed to load departments",

    ADD_RULE_SUCCESS: "Availability rule added successfully",
    UPDATE_RULE_SUCCESS: "Availability rule updated successfully",
    ADD_RULE_FAILED: "Failed to add rule",
    UPDATE_RULE_FAILED: "Failed to update rule",
    DELETE_RULE_SUCCESS: "Rule deleted successfully",
    DELETE_RULE_FAILED: "Failed to delete rule",

    ADD_EXCEPTION_SUCCESS: "Availability exception added successfully",
    ADD_EXCEPTION_FAILED: "Failed to add availability exception",
    DELETE_EXCEPTION_SUCCESS: "Availability exception deleted successfully",
    DELETE_EXCEPTION_FAILED: "Failed to delete availability exception",

    CONFIRM_DELETE_RULE: (day: string, start: string, end: string, slot: number) =>
      `Delete rule: ${day} ${start}–${end} (slot ${slot}m)?`,
    CONFIRM_DELETE_EXCEPTION: "Are you sure you want to delete this exception?",
  },

  FORGOT_PASSWORD: {
    OTP_SENT: "OTP sent to your email.",
    OTP_FAILED: "Failed to send OTP. Please try again.",
    RESET_SUCCESS: "Password reset successful!",
    RESET_FAILED: "Failed to reset password. Please try again.",
    ENTER_EMAIL: "Please enter your email.",
    ENTER_OTP: "Please enter the OTP.",
    ENTER_NEW_PASSWORD: "Please enter a new password.",
  },
  ONLINE_CONSULTATION: {
    FETCH_DOCTORS_FAILED: "Failed to load doctors. Please try again later.",
    FETCH_DEPARTMENTS_FAILED: "Failed to load departments. Please try again later.",
  },
  WALLET: {
    FETCH_FAILED: "Failed to load wallet info.",
    NO_TRANSACTIONS: "No transactions yet.",
    BALANCE: "Available Balance",
    TRANSACTION_HISTORY: "Transaction History",
    PREVIOUS_PAGE_DISABLED: "You are on the first page.",
    NEXT_PAGE_DISABLED: "You are on the last page.",
  },
  PLACEHOLDER: {
    EMAIL: "Enter your email",
    PASSWORD: "Enter your password",
  },
};

export const NotificationDefaults = {
  SUCCESS: "Operation successful",
  ERROR: "Something went wrong",
  INFO: "Information",
  WARNING: "Warning",
};
