  import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { IGetBookingDetailsDoctor } from "../interfaces/doctor/IGetBookingDetailsDoctor";

  export class GetBookingDetailsDoctor implements IGetBookingDetailsDoctor{
    constructor(private bookingRepo: IBookingRepository) {}

    async execute(bookingId: string, doctorId: string) {

      if (!bookingId || !doctorId) {
        const err: any = new Error( ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED);
        err.statusCode = 400;
        throw err;
      }

      const booking = await this.bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);


      if (!booking) {
        const err: any = new Error( ErrorMessages.BOOKING_NOT_FOUND_OR_UNAUTHORIZED);
        err.statusCode = 404;
        throw err;
      }
      const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);

      return {
        ...booking,
        totalAmount
      };
    }
  }
