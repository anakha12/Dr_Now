import { plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";

export class GetBookingDetails implements GetBookingDetails{
  constructor(private bookingRepo: IBookingRepository) {}

  async execute(bookingId: string, userId: string) {
    
    if (!bookingId || !userId) {
      const err: any = new Error("Booking ID and User ID are required");
      err.statusCode = 400;
      throw err;
    }

    const booking = await this.bookingRepo.findBookingByIdAndUser(bookingId, userId);
  
    if (!booking) {
      const err: any = new Error("Booking not found or unauthorized");
      err.statusCode = 404;
      throw err;
    }

    const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);
    
    const bookingDTOs=plainToInstance(BookingResponseDTO, booking,
      { excludeExtraneousValues: true }
    )
  
  return {
      ...bookingDTOs,
      totalAmount
    };
  }
}
