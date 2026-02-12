import { GetUserBookingsRequestDTO } from "../../../../interfaces/dto/request/user-booking-user.dto";
import { BookingResponseDTO } from "../../../../interfaces/dto/response/user/bookings.dto";

export interface IGetUserBookings {
  execute(dto: GetUserBookingsRequestDTO): Promise<{
    bookings: BookingResponseDTO[];
    totalPages: number;
    currentPage: number;
  }>;
}


