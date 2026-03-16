import { BookingResponseDTO } from "../../../../interfaces/dto/response/user/bookings.dto";
export interface IGetBookingDetails {
  execute(bookingId: string, userId: string): Promise<BookingResponseDTO>;
}
