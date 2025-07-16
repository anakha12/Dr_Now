import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetPendingDoctorPayouts {
  constructor(
    private _bookingRepo: IBookingRepository,
    private _doctorRepo: IDoctorRepository
  ) {}

  async execute() {
 
    const allDoctors = await this._doctorRepo.getAllDoctors();
    const result = [];

    for (const doctor of allDoctors) {
        
      if (!doctor.id) continue; 
      const bookings = await this._bookingRepo.getDoctorBookings(doctor.id);

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
