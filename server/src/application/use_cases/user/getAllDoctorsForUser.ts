// application/use_cases/user/getAllDoctorsForUser.ts
import { DoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";

export class GetAllDoctorsForUser {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(): Promise<DoctorEntity[]> {
    // You can add filters like isVerified === true if needed
    return this.doctorRepo.getAllDoctors();
  }
}
