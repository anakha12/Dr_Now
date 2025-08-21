export interface IGetBookingDetailsDoctor {
  execute(bookingId: string, doctorId: string): Promise<any>;
}