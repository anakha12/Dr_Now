
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";

export class GetAllDoctorsForUser {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(): Promise<DoctorEntity[]> {
    return this._doctorRepo.getAllDoctors();
  }
}
