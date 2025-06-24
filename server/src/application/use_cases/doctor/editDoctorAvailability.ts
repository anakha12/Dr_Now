import { DoctorRepositoryImpl } from "../../../infrastructure/database/repositories/doctorRepositoryImpl";

interface Slot {
  from: string;
  to: string;
}

export class EditDoctorAvailability {
  constructor(private doctorRepo: DoctorRepositoryImpl) {}

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

  async execute(
    doctorId: string,
    oldSlot: { date: string; from: string; to: string },
    newSlot: { date: string; from: string; to: string }
  ) {
    const oldSlots = this.generateTimeSlots(oldSlot.from, oldSlot.to);

    
    const booked = await this.doctorRepo.checkIfAnySlotBooked(doctorId, oldSlot.date, oldSlots);

    if (booked) {
      throw new Error("One or more slots in the old schedule are already booked and cannot be edited.");
    }

   
    await this.doctorRepo.removeAllSlotsOnDate(doctorId, oldSlot.date);
    const newSlots = this.generateTimeSlots(newSlot.from, newSlot.to);

    return await this.doctorRepo.addAvailability(doctorId, {
      date: newSlot.date,
      slots: newSlots,
    });
  }
}
