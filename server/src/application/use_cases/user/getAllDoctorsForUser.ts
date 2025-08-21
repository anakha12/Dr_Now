
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";
import { IGetAllDoctorsForUser } from "../interfaces/user/IGetAllDoctorsForUser";

export class GetAllDoctorsForUser implements IGetAllDoctorsForUser{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(): Promise<DoctorEntity[]> {
    return this._doctorRepo.getAllDoctors();
  }
}
