import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorProfile {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string) {
    const doctor = await this.doctorRepository.findById(id);
    
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }
}
