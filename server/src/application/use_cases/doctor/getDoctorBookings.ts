import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { DoctorBookingListResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-booking-response.dto"
import { IGetDoctorBookings } from "../interfaces/doctor/IGetDoctorBookings";
import { plainToInstance } from "class-transformer";

export class GetDoctorBookings implements IGetDoctorBookings{
  constructor(private _bookingRepository: IBookingRepository) {}
  
async execute(
  doctorId: string,
  page: number,
  limit: number
): Promise<{ bookings: DoctorBookingListResponseDTO[]; totalPages: number }> {
  const { bookings, totalPages } =
    await this._bookingRepository.getDoctorBookings(doctorId, page, limit);

  const bookingDTOs = bookings.map((b) => ({
    id: b.id,
    date: b.date,
    status: b.status,
    patientName: b.patientName || "Unknown",
    department: b.department || "N/A",
    slot: b.startTime && b.endTime ? { from: b.startTime, to: b.endTime } : undefined,
    prescription: b.prescription ?? null,
  }));

  return {
    bookings: plainToInstance(DoctorBookingListResponseDTO, bookingDTOs, {
      excludeExtraneousValues: true,
    }),
    totalPages,
  };
}

}