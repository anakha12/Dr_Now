import { BookingRepository } from "../../../domain/repositories/bookingRepository";

export class GetBookedSlots {
  constructor(private bookingRepo: BookingRepository) {}

  async execute(doctorId: string, date: string) {
    return await this.bookingRepo.getBookedSlotsByDoctorAndDate(doctorId, date);
  }
}

