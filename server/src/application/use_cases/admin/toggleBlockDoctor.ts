
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class ToggleBlockDoctor {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(doctorId: string, action: "block" | "unblock"): Promise<void> {

    const doctor = await this.doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const isBlocked = action === "block";
    await this.doctorRepo.updateBlockedStatus(doctorId, isBlocked);
  }
}
