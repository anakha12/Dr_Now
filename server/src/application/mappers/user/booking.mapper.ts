import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { BookingWithExtras } from "../../../domain/types/BookingWithExtras";

export class BookingMapper {

  static toResponseDTO(bookings: BookingWithExtras[]): BookingResponseDTO[] {
    return bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      doctorId: b.doctorId,
      doctorName: b.doctorName,
      department: b.department,
      patientName: b.patientName,
      slot: {
        from: b.startTime,
        to: b.endTime,
      },
      date: b.date,
      status: b.status,
      paymentStatus: b.paymentStatus,
      transactionId: b.transactionId,
      doctorEarning: b.doctorEarning,
      commissionAmount: b.commissionAmount,
      payoutStatus: b.payoutStatus,
      refundStatus: b.refundStatus,
      cancellationReason: b.cancellationReason ?? '',
      createdAt: b.createdAt,
      time: `${b.startTime} - ${b.endTime}`,
      amount: (b.doctorEarning ?? 0) + (b.commissionAmount ?? 0),
      canCancel:
        b.paymentStatus === 'paid' && b.status !== 'Cancelled',
    }));
  }
}