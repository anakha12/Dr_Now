import { BookingDetailsDoctorResponseDTO } from "../../../../interfaces/dto/response/doctor/booking-details-doctor-response.dto";

export interface IGetBookingDetailsDoctor {
  execute(dto: { bookingId: string; doctorId: string }): Promise<BookingDetailsDoctorResponseDTO>;
}
