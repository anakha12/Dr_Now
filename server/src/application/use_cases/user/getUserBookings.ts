import { instanceToPlain, plainToInstance } from "class-transformer";
import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IGetUserBookings } from "../interfaces/user/IGetUserBookings";
import { BookingResponseDTO } from "../../../interfaces/dto/response/user/bookings.dto";

export class GetUserBookings implements IGetUserBookings{
  constructor(private readonly _bookingRepository: IBookingRepository) {}

 async execute(userId: string, page: number, limit: number) {
  const { bookings, total } = await this._bookingRepository.findUserBookings(userId, page, limit);

  const bookingDTOs=plainToInstance(BookingResponseDTO, bookings.map(b => ({ ...b, id: b.id })),
  { excludeExtraneousValues: true }
  )

  const plainBookings= bookingDTOs.map(dto=> instanceToPlain(dto))

  const totalPages = Math.ceil(total / limit);

  return { bookings: plainBookings, totalPages };
}

}
