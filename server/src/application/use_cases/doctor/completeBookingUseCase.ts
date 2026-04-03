
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ICompleteBookingUseCase } from "../interfaces/doctor/ICompleteBookingUseCase";

export class CompleteBookingUseCase implements ICompleteBookingUseCase {
  constructor(private readonly bookingRepo: IBookingRepository) {}

  async execute(bookingId: string, doctorId: string): Promise<void> {
    const booking = await this.bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);
    if (!booking) throw new Error("Booking not found or unauthorized");

    if (booking.status !== "Completed") {
      booking.status = "Completed";
      await this.bookingRepo.updateBookingStatus(booking);
    }
  }
}