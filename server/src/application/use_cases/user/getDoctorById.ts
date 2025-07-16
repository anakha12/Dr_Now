import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetDoctorById {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(id: string) {
    return await this._doctorRepo.findById(id);
  }
}
