import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

interface Slot {
  from: string;
  to: string;
}

export class RemoveDoctorSlot {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(doctorId: string, date: string, slot: Slot): Promise<void> {
    if (!date || !slot.from || !slot.to) {
      throw new Error("Date and slot times are required.");
    }

    // Step 1: Get doctor and availability
    const doctor = await this.doctorRepo.findById(doctorId);
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

    // Step 2: Check if booked
    const isBooked = await this.doctorRepo.checkIfAnySlotBooked(doctorId, date, [slot]);
    if (isBooked) {
      throw new Error("Cannot remove: slot is already booked.");
    }

    // Step 3: Safe to remove
    await this.doctorRepo.removeSlot(doctorId, date, slot);
  }
}
