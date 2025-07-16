  import { IBookingRepository } from "../../../domain/repositories/bookingRepository";

  export class GetBookingDetailsDoctor {
    constructor(private bookingRepo: IBookingRepository) {}

    async execute(bookingId: string, doctorId: string) {
      console.log("bookingId",bookingId);
      console.log("doctorId",doctorId)
      if (!bookingId || !doctorId) {
        const err: any = new Error("Booking ID and User ID are required");
        err.statusCode = 400;
        throw err;
      }

      const booking = await this.bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);
      console.log("Booking fetched:", booking);

      if (!booking) {
        const err: any = new Error("Booking not found or unauthorized");
        err.statusCode = 404;
        throw err;
      }
      const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);
      console.log(totalAmount)
      return {
        ...booking,
        totalAmount
      };
    }
  }
