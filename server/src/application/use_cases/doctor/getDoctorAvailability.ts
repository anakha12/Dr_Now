import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorAvailability {
  constructor(private readonly _doctorRepository: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctor = await this._doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return doctor.availability;
  }
}
