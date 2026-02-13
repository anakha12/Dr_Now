import { BaseUseCase } from "../base-usecase";
import { IGetBookingDetailsDoctor } from "../interfaces/doctor/IGetBookingDetailsDoctor";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { BookingDetailsDoctorResponseDTO } from "../../../interfaces/dto/response/doctor/booking-details-doctor-response.dto";
import { plainToInstance } from "class-transformer";
import { AppError } from "../../../utils/AppError";
import { ErrorMessages } from "../../../utils/Messages";
import { HttpStatus } from "../../../utils/HttpStatus";
import { GetBookingDetailsDoctorDTO } from "../../../interfaces/dto/request/get-booking-details-doctor.dto";

export class GetBookingDetailsDoctor
  extends BaseUseCase<{ bookingId: string; doctorId: string }, BookingDetailsDoctorResponseDTO>
  implements IGetBookingDetailsDoctor
{
  constructor(private readonly _bookingRepo: IBookingRepository) {
    super();
  }

  async execute(dto: { bookingId: string; doctorId: string }): Promise<BookingDetailsDoctorResponseDTO> {

    const { bookingId, doctorId } = await this.validateDto(GetBookingDetailsDoctorDTO,dto);

    if (!bookingId || !doctorId) {
      throw new AppError(ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED, HttpStatus.BAD_REQUEST);
    }


    const booking = await this._bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);

    if (!booking) {
      throw new AppError(ErrorMessages.BOOKING_NOT_FOUND_OR_UNAUTHORIZED, HttpStatus.NOT_FOUND);
    }

    const totalAmount = (booking.doctorEarning ?? 0) + (booking.commissionAmount ?? 0);

    return plainToInstance(BookingDetailsDoctorResponseDTO, {
      id: booking.id,
      userId: booking.userId,
      doctorId: booking.doctorId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      doctorEarning: booking.doctorEarning,
      commissionAmount: booking.commissionAmount,
      totalAmount,
    });
  }
}
