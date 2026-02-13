import { CancelDoctorBookingResponseDTO } from "../../../../interfaces/dto/response/doctor/cancel-doctor-booking-response.dto";

export interface ICancelDoctorBooking {
  execute(
    doctorId: string,
    bookingId: string,
    reason: string
  ): Promise<CancelDoctorBookingResponseDTO>;
}
