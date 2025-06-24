import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/bookingEntity";

export class GetDoctorBookings {
  constructor(private bookingRepository: BookingRepository) {}

  async execute(doctorId: string): Promise<Booking[]> {
    const bookings = await this.bookingRepository.getDoctorBookings(doctorId);
    return bookings;
  }
}
