
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IToggleBlockDoctor } from "../interfaces/admin/IToggleBlockDoctor";

export class ToggleBlockDoctor implements IToggleBlockDoctor{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(doctorId: string, action: "block" | "unblock"): Promise<void> {

    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const isBlocked = action === "block";
    await this._doctorRepo.updateBlockedStatus(doctorId, isBlocked);
  }
}
