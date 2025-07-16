import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

interface Slot {
  from: string;
  to: string;
}

interface AvailabilityPayload {
  date: string;
  from: string;
  to: string;
}

export class AddDoctorAvailability {
  constructor(private _doctorRepo: IDoctorRepository) {}

  private generateTimeSlots(from: string, to: string, interval: number = 30): Slot[] {
    const slots: Slot[] = [];
    const start = new Date(`1970-01-01T${from}:00`);
    const end = new Date(`1970-01-01T${to}:00`);
    const cursor = new Date(start);

    while (cursor < end) {
      const slotStart = cursor.toTimeString().slice(0, 5);
      cursor.setMinutes(cursor.getMinutes() + interval);
      if (cursor > end) break;
      const slotEnd = cursor.toTimeString().slice(0, 5);
      slots.push({ from: slotStart, to: slotEnd });
    }

    return slots;
  }

  private isOverlapping(slot1: Slot, slot2: Slot): boolean {
    return slot1.from < slot2.to && slot1.to > slot2.from;
  }

  async execute(doctorId: string, payload: AvailabilityPayload) {
    const { date, from, to } = payload;

    if (!date || !from || !to) {
      throw new Error("Date, from, and to are required");
    }

    const newSlots = this.generateTimeSlots(from, to);
    if (newSlots.length === 0) {
      throw new Error("Invalid time range — no slots generated");
    }

    const doctor = await this._doctorRepo.getDoctorById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const existingDay = doctor.availability.find((entry) => entry.date === date);

    if (existingDay) {

      for (const newSlot of newSlots) {
        const conflict = existingDay.slots.some(existingSlot =>
          this.isOverlapping(existingSlot, newSlot)
        );

        if (conflict) {
          throw new Error(`Slot ${newSlot.from}–${newSlot.to} overlaps with existing schedule`);
        }
      }

      existingDay.slots.push(...newSlots);
    } else {

      doctor.availability.push({ date, slots: newSlots });
    }
    await this._doctorRepo.updateDoctor(doctorId, { availability: doctor.availability });

    return { message: "Availability added successfully" };
  }
}
