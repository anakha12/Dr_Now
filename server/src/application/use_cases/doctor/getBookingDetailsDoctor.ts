import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { IGetBookingDetailsDoctor } from "../interfaces/doctor/IGetBookingDetailsDoctor";
import { AppError } from "../../../utils/AppError";

  export class GetBookingDetailsDoctor implements IGetBookingDetailsDoctor{
    constructor(private bookingRepo: IBookingRepository) {}

    async execute(bookingId: string, doctorId: string) {

      if (!bookingId || !doctorId) {
        throw new AppError(ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED, 400);
      }

      const booking = await this.bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);


      if (!booking) {
        throw new AppError(ErrorMessages.BOOKING_NOT_FOUND_OR_UNAUTHORIZED, 404);
      }
      const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);

      return {
        ...booking,
        totalAmount
      };
    }
  }
