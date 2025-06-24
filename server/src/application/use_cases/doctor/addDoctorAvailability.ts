import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

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
  constructor(private doctorRepo: DoctorRepository) {}

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

  async execute(doctorId: string, payload: AvailabilityPayload) {
    const { date, from, to } = payload;

    if (!date || !from || !to) {
      throw new Error("Date, from, and to are required");
    }

    const slots = this.generateTimeSlots(from, to);

    if (slots.length === 0) {
      throw new Error("Invalid time range — no slots generated");
    }

    return await this.doctorRepo.addAvailability(doctorId, { date, slots });
  }
}
