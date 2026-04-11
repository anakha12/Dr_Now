import { BaseUseCase } from "../base-usecase";
import { IGetBookingDetailsDoctor } from "../interfaces/doctor/IGetBookingDetailsDoctor";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { BookingDetailsDoctorResponseDTO } from "../../../interfaces/dto/response/doctor/booking-details-doctor-response.dto";
import { AppError } from "../../../utils/AppError";
import { ErrorMessages } from "../../../utils/Messages";
import { HttpStatus } from "../../../utils/HttpStatus";
import { GetBookingDetailsDoctorDTO } from "../../../interfaces/dto/request/get-booking-details-doctor.dto";
import { BookingDoctorMapper } from "../../mappers/doctor/booking.mapper";


export class GetBookingDetailsDoctor
  extends BaseUseCase<{ bookingId: string; doctorId: string }, BookingDetailsDoctorResponseDTO>
  implements IGetBookingDetailsDoctor
{
  constructor(private readonly _bookingRepo: IBookingRepository) {
    super();
  }

  async execute(dto: { bookingId: string; doctorId: string }): Promise<BookingDetailsDoctorResponseDTO> {

    const { bookingId, doctorId } = await this.validateDto(GetBookingDetailsDoctorDTO, dto);

    if (!bookingId || !doctorId) {
      throw new AppError(
        ErrorMessages.BOOKING_ID_AND_DOCTOR_ID_REQUIRED,
        HttpStatus.BAD_REQUEST
      );
    }

    const booking = await this._bookingRepo.findBookingByIdAndDoctor(bookingId, doctorId);

    if (!booking) {
      throw new AppError(
        ErrorMessages.BOOKING_NOT_FOUND_OR_UNAUTHORIZED,
        HttpStatus.NOT_FOUND
      );
    }

     return BookingDoctorMapper.toResponseDTO(booking);
  }
}  