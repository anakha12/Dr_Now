import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorAvailability {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async execute(doctorId: string) {
    const doctor = await this.doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return doctor.availability;
  }
}
