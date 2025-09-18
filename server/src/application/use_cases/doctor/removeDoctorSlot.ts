import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { IRemoveDoctorSlot } from "../interfaces/doctor/IRemoveDoctorSlot";

interface Slot {
  from: string;
  to: string;
}

export class RemoveDoctorSlot implements IRemoveDoctorSlot{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, date: string, slot: Slot): Promise<void> {
    if (!date || !slot.from || !slot.to) {
      throw new Error( ErrorMessages.SLOT_TIME_REQUIRED );
    }

    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error( ErrorMessages.DOCTOR_NOT_FOUND);

    const availabilityEntry = doctor.availability.find((entry) => entry.date === date);
    if (!availabilityEntry) {
      throw new Error( ErrorMessages.NO_AVAILABILITY_FOR_DATE );
    }

    const slotExists = availabilityEntry.slots.some(
      (s) => s.from === slot.from && s.to === slot.to
    );

    if (!slotExists) {
      throw new Error( ErrorMessages.SLOT_NOT_FOUND);
    }

    const isBooked = await this._doctorRepo.checkIfAnySlotBooked(doctorId, date, [slot]);
    if (isBooked) {
      throw new Error( ErrorMessages.SLOT_ALREADY_BOOKED);
    }

    await this._doctorRepo.removeSlot(doctorId, date, slot);
  }
}
