import { DoctorBookingListResponseDTO } from "../../../../interfaces/dto/response/doctor/doctor-booking-response.dto"; 

export interface IGetDoctorBookings {
  execute(
    doctorId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: DoctorBookingListResponseDTO[];
    totalPages: number;
  }>;
}
