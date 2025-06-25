import { BookingRepository } from "../../../domain/repositories/bookingRepository";
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetPendingDoctorPayouts {
  constructor(
    private bookingRepo: BookingRepository,
    private doctorRepo: DoctorRepository
  ) {}

  async execute() {
 
    const allDoctors = await this.doctorRepo.getAllDoctors();
    const result = [];

    for (const doctor of allDoctors) {
        
      if (!doctor.id) continue; 
      const bookings = await this.bookingRepo.getDoctorBookings(doctor.id);

      const unpaid = bookings.filter(
        (b) =>
           (b.status === "Completed" || b.status === "Upcoming") &&
            b.paymentStatus === "paid" &&
            b.doctorEarning &&
            b.payoutStatus === "Pending"
      );

      const totalPendingEarnings = unpaid.reduce(
        (acc, b) => acc + (b.doctorEarning || 0),
        0
      );

      if (totalPendingEarnings > 0) {
        result.push({
          doctorId: doctor.id,
          doctorName: doctor.name,
          totalPendingEarnings,
        });
      }
    }

    return result;
  }
}
