export interface IGetBookingDetails {
  execute(bookingId: string, userId: string): Promise<any>;
}
