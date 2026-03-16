import { SlotDto } from "../../../../interfaces/dto/response/user/slot.dto";

export interface IGetBookedSlots {
  execute(doctorId: string, date: string): Promise<SlotDto[]>;
}