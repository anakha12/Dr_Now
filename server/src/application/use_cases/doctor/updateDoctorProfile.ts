import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class UpdateDoctorProfile {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string, updates: any) {
    const updated = await this.doctorRepository.updateDoctor(id, updates);
    if (!updated) throw new Error("Failed to update profile");
    return updated;
  }
}
