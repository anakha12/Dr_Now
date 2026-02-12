import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IGetUserBookings } from "../interfaces/user/IGetUserBookings";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { GetUserBookingsRequestDTO } from "../../../interfaces/dto/request/user-booking-user.dto";
import { BaseUseCase } from "../base-usecase";
import { BookingWithExtras } from "../../../domain/types/BookingWithExtras";

export class GetUserBookings extends BaseUseCase<
  GetUserBookingsRequestDTO,
  { bookings: BookingResponseDTO[]; totalPages: number; currentPage: number }
> implements IGetUserBookings {

  constructor(private readonly bookingRepository: IBookingRepository) {
    super();
  }

  async execute(dto: GetUserBookingsRequestDTO): Promise<{
    bookings: BookingResponseDTO[];
    totalPages: number;
    currentPage: number;
  }> {
  
    const { bookings, total } = await this.bookingRepository.findUserBookingsWithFilters(
      dto.userId,
      {
        status: dto.status,
        date: dto.date,
        doctorName: dto.doctorName,
        specialization: dto.specialization
      },
      dto.page,
      dto.limit
    );

    const bookingDTOs: BookingResponseDTO[] = (bookings as BookingWithExtras[]).map(b => ({
      id: b.id,
      userId: b.userId,
      doctorId: b.doctorId,
      doctorName: b.doctorName,
      department: b.department,
      patientName: b.patientName,
      slot: { from: b.startTime, to: b.endTime },
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
      canCancel: b.paymentStatus === 'paid' && b.status !== 'Cancelled'
    }));

    return {
      bookings: bookingDTOs,
      totalPages: Math.ceil(total / dto.limit),
      currentPage: dto.page,
    };
  }
}
