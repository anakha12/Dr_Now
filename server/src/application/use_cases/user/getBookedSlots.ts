import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { IGetBookedSlots } from "../interfaces/user/IGetBookedSlots";

export class GetBookedSlots implements IGetBookedSlots{
  constructor(private _bookingRepo: IBookingRepository) {}

  async execute(doctorId: string, date: string) {
    return await this._bookingRepo.getBookedSlotsByDoctorAndDate(doctorId, date);
  }
}

