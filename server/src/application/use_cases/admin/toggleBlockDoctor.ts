
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class ToggleBlockDoctor {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, action: "block" | "unblock"): Promise<void> {

    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const isBlocked = action === "block";
    await this._doctorRepo.updateBlockedStatus(doctorId, isBlocked);
  }
}
