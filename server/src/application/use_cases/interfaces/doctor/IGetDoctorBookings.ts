import { Booking } from "../../../../domain/entities/booking.entity";

export interface IGetDoctorBookings {
  execute(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: Booking[];
    totalPages: number;
  }>;
}
