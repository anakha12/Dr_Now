import { plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { ErrorMessages } from "../../../utils/Messages";
import { AppError } from "../../../utils/AppError";

export class GetBookingDetails implements GetBookingDetails{
  constructor(private bookingRepo: IBookingRepository) {}

  async execute(bookingId: string, userId: string) {2
    
    if (!bookingId || !userId) {
      throw new AppError(ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED, 400);
    }

    const booking = await this.bookingRepo.findBookingByIdAndUser(bookingId, userId);
  
    if (!booking) {
      throw new AppError(ErrorMessages.BOOKING_NOT_FOUND, 404);
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

