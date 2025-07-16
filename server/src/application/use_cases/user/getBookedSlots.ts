import { IBookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetBookedSlots {
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(doctorId: string, date: string) {
    return await this._bookingRepo.getBookedSlotsByDoctorAndDate(doctorId, date);
  }
}

