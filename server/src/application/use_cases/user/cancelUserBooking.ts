import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class CancelUserBookingUseCase {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(bookingId: string, userId: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return { success: false, message: "Booking not found" };
    }

    if (booking.userId.toString() !== userId.toString()) {
      return { success: false, message: "Unauthorized" };
    }

    if (booking.status !== "Upcoming") {
      return { success: false, message: "Only upcoming bookings can be cancelled" };
    }

    await this.bookingRepository.cancelBooking(bookingId); // ✅ Use repository method

    return { success: true };
  }
}
