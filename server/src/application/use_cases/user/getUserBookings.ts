import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IGetUserBookings } from "../interfaces/user/IGetUserBookings";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";
import { GetUserBookingsRequestDTO } from "../../../interfaces/dto/request/user-booking-user.dto";
import { BaseUseCase } from "../base-usecase";
import { BookingWithExtras } from "../../../domain/types/BookingWithExtras";
import { BookingMapper } from "../../mappers/user/booking.mapper";


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

    const bookingDTOs: BookingResponseDTO[] =
      BookingMapper.toResponseDTO(bookings as BookingWithExtras[]);

    return {
      bookings: bookingDTOs,
      totalPages: Math.ceil(total / dto.limit),
      currentPage: dto.page,
    };
  }
}