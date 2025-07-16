import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorProfile {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(id: string) {
    const doctor = await this._doctorRepository.findById(id);
    
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  }
}
