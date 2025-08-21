export interface ICancelDoctorBooking {
  execute(
    doctorId: string,
    bookingId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message?: string;
  }>;
}
