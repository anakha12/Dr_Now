import { IBookingRepository } from "../../../domain/repositories/bookingRepository";
import { SlotDto } from "../../../interfaces/dto/response/user/slot.dto";
import { plainToInstance } from "class-transformer";

export class GetBookedSlotsUseCase {
  constructor(private bookingRepo: IBookingRepository) {}

  async execute(doctorId: string, date: string): Promise<SlotDto[]> {
    const bookings = await this.bookingRepo.findBookingsByDoctorAndDate(doctorId, date);
    const bookedSlots = bookings.map(
      (b) => new SlotDto(b.startTime, b.endTime, true)
    );
    return plainToInstance(SlotDto, bookedSlots);
  }
}
