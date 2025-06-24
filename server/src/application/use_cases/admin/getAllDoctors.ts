import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";

export class GetAllDoctors {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(): Promise<DoctorEntity[]> {
    // Fetch all doctors (you might add filters/pagination if needed)
    return this.doctorRepo.getAllDoctors();
  }
}
