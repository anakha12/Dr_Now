import { CancelBookingRequestDTO } from "../../../../interfaces/dto/request/cancel-booking.request.dto";
import { CancelBookingResponseDTO } from "../../../../interfaces/dto/response/user/cancel-booking.dto";

export interface ICancelUserBooking {
  execute(
    data: CancelBookingRequestDTO
  ): Promise<CancelBookingResponseDTO>;
}
