import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class UpdateDoctorProfile {
  constructor(
    private doctorRepository: DoctorRepository,
    private bookingRepository: BookingRepository
  ) {}

  async execute(doctorId: string, updates: any) {
    const hasActiveBookings = await this.bookingRepository.hasActiveBookingsForDoctor(doctorId);
    
    if (hasActiveBookings) {
      throw new Error("You cannot update your profile while bookings exist.");
    }

    // If confirmation not received, return message
    if (!updates.confirm) {
      return { message: "confirmation_required" };
    }

    const updated = await this.doctorRepository.updateDoctor(doctorId, {
      ...updates,
      isVerified: false,
      isBlocked: true,
    });

    if (!updated) throw new Error("Failed to update profile");
    return updated;
  }
}
