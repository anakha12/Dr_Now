import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorAvailability } from "../interfaces/doctor/IGetDoctorAvailability";

export class GetDoctorAvailability implements IGetDoctorAvailability{
  constructor(private readonly _doctorRepository: IDoctorRepository) {}

  async execute(doctorId: string) {
    const doctor = await this._doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return doctor.availability;
  }
}
