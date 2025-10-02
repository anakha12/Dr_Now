export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  DOCTOR = 'doctor'
}

export const EmailSubjects = {
  DOCTOR_REJECTED: "Doctor Application Rejected",
  DOCTOR_VERIFIED: "Doctor Verification Successful",
};

export const EmailTemplates = {
  DOCTOR_REJECTED: (doctorName: string, reason?: string) =>
    `Dear Dr. ${doctorName},\n\nWe regret to inform you that your application to join our platform as a doctor has been rejected after careful review.${
      reason ? `\nReason: ${reason}` : ""
    }\nIf you believe this was a mistake or have any questions, please reach out to our support team.\n\nBest regards,\nTeam`,

  DOCTOR_VERIFIED: (doctorName: string) =>
    `Dear Dr. ${doctorName},\n\nYour application to become a doctor has been successfully verified.\nYou can now log in and access your account.\n\nBest regards,\nTeam`,
} as const;
