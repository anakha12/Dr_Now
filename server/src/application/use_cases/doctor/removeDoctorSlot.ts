import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IRemoveDoctorSlot } from "../interfaces/doctor/IRemoveDoctorSlot";

interface Slot {
  from: string;
  to: string;
}

export class RemoveDoctorSlot implements IRemoveDoctorSlot{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, date: string, slot: Slot): Promise<void> {
    if (!date || !slot.from || !slot.to) {
      throw new Error("Date and slot times are required.");
    }

    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const availabilityEntry = doctor.availability.find((entry) => entry.date === date);
    if (!availabilityEntry) {
      throw new Error("No availability found for this date.");
    }

    const slotExists = availabilityEntry.slots.some(
      (s) => s.from === slot.from && s.to === slot.to
    );

    if (!slotExists) {
      throw new Error("Slot does not exist or has already been removed.");
    }

    const isBooked = await this._doctorRepo.checkIfAnySlotBooked(doctorId, date, [slot]);
    if (isBooked) {
      throw new Error("Cannot remove: slot is already booked.");
    }

    await this._doctorRepo.removeSlot(doctorId, date, slot);
  }
}
