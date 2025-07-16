import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";

export class GetAllDoctors {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(page: number, limit: number): Promise<{ doctors: DoctorEntity[]; totalDoctors: number }> {
    const skip = (page - 1) * limit;

    const doctors = await this._doctorRepo.getPaginatedDoctors(skip, limit);
    const totalDoctors = await this._doctorRepo.countDoctors(); 

    return { doctors, totalDoctors };
  }
}
