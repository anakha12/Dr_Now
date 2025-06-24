import { DoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorById {
  constructor(private doctorRepo: DoctorRepository) {}

  async execute(id: string) {
    return await this.doctorRepo.findById(id);
  }
}
