import { plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { ErrorMessages } from "../../../utils/Messages";

export class GetBookingDetails implements GetBookingDetails{
  constructor(private bookingRepo: IBookingRepository) {}

  async execute(bookingId: string, userId: string) {
    
    if (!bookingId || !userId) {
      const err: any = new Error( ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED);
      err.statusCode = 400;
      throw err;
    }

    const booking = await this.bookingRepo.findBookingByIdAndUser(bookingId, userId);
  
    if (!booking) {
      const err: any = new Error( ErrorMessages.BOOKING_NOT_FOUND );
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
