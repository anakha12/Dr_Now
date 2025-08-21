import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorById } from "../interfaces/user/IGetDoctorById";

export class GetDoctorById implements IGetDoctorById{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(id: string) {
    return await this._doctorRepo.findById(id);
  }
}
