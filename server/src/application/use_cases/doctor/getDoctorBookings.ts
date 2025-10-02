import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { Booking } from "../../../domain/entities/booking.entity";
import { IGetDoctorBookings } from "../interfaces/doctor/IGetDoctorBookings";

export class GetDoctorBookings implements IGetDoctorBookings{
  constructor(private _bookingRepository: IBookingRepository) {}

  async execute(doctorId: string, page: number, limit: number): Promise<{ bookings: Booking[], totalPages: number }> {
    let data=await this._bookingRepository.getDoctorBookings(doctorId, page, limit);
    return await this._bookingRepository.getDoctorBookings(doctorId, page, limit);
  }
}

