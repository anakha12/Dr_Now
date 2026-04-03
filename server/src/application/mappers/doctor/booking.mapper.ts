import { BookingDetailsDoctorResponseDTO } from "../../../interfaces/dto/response/doctor/booking-details-doctor-response.dto";
import { Booking } from "../../../domain/entities/bookingEntity";

export class BookingDoctorMapper {

  static toResponseDTO(booking: Booking): BookingDetailsDoctorResponseDTO {
    const doctorEarning = booking.doctorEarning ?? 0;
    const commissionAmount = booking.commissionAmount ?? 0;
    const totalAmount = doctorEarning + commissionAmount;

    return {
      id: booking.id ?? "",
      patientName: booking.patientName ?? "",
      department: booking.department ?? "",
      date: booking.date,
      slot: {
        from: booking.startTime,
        to: booking.endTime,
      },

      status: booking.status,
      doctorEarning,
      commissionAmount,

      totalAmount,

      payoutStatus: booking.payoutStatus,
      cancellationReason: booking.cancellationReason ?? undefined,

      createdAt: booking.createdAt,
    };
  }
}