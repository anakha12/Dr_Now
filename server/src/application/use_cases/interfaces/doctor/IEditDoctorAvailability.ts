interface Slot {
  from: string;
  to: string;
}

export interface IEditDoctorAvailability {
  execute(
    doctorId: string,
    oldSlot: { date: string; from: string; to: string },
    newSlot: { date: string; from: string; to: string }
  ): Promise<void>;
}
