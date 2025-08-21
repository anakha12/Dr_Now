export interface ICancelUserBooking {
  execute(bookingId: string, userId: string, reason: string): Promise<{ success: boolean; message?: string }>;
}
