import { plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { ErrorMessages } from "../../../utils/Messages";
import { AppError } from "../../../utils/AppError";
import { HttpStatus } from "../../../utils/HttpStatus";

export class GetBookingDetails implements GetBookingDetails{
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(
    bookingId: string,
    userId: string
  ): Promise<BookingResponseDTO> {
      
    if (!bookingId || !userId) {
      throw new AppError(ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED, HttpStatus.BAD_REQUEST);
    }

    const booking = await this._bookingRepo.findBookingByIdAndUser(bookingId, userId);
  
    if (!booking) {
      throw new AppError(ErrorMessages.BOOKING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return plainToInstance(
    BookingResponseDTO,
    booking,
    { excludeExtraneousValues: true }
  );
}

}