import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetUnverifiedDoctors {
  private doctorRepo: DoctorRepository;

  constructor(doctorRepo: DoctorRepository) {
    this.doctorRepo = doctorRepo;
  }

  async execute() {
    const doctors = await this.doctorRepo.findUnverifiedDoctors();
    return doctors;
  }
}