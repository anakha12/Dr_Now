import { IDoctorRepository } from "../../../../domain/repositories/doctorRepository";

export interface Slot {
  from: string;
  to: string;
}

export interface IRemoveDoctorSlot {
  execute(doctorId: string, date: string, slot: Slot): Promise<void>;
}
