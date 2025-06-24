import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class CancelDoctorBooking {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(doctorId: string, bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.doctorId !== doctorId) {
      throw new Error("You are not authorized to cancel this booking");
    }

    await this.bookingRepository.cancelBooking(bookingId);
  }
}
