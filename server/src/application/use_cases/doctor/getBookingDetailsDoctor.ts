import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { IGetBookingDetailsDoctor } from "../interfaces/doctor/IGetBookingDetailsDoctor";
import { AppError } from "../../../utils/AppError";
import { HttpStatus } from "../../../utils/HttpStatus";
import { Http } from "winston/lib/winston/transports";

  export class GetBookingDetailsDoctor implements IGetBookingDetailsDoctor{
    constructor(private _bookingRepo: IBookingRepository) {}

    async execute(bookingId: string, doctorId: string) {

      if (!bookingId || !doctorId) {
        throw new AppError(ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED, HttpStatus.BAD_REQUEST);
      }

      const booking = await this._bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);


      if (!booking) {
        throw new AppError(ErrorMessages.BOOKING_NOT_FOUND_OR_UNAUTHORIZED, HttpStatus.NOT_FOUND);
      }
      const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);

      return {
        ...booking,
        totalAmount
      };
    }
  }
