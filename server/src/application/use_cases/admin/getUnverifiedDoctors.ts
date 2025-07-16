import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";

export class GetUnverifiedDoctors {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const doctors = await this._doctorRepo.getUnverifiedDoctorsPaginated(skip, limit);
    const total = await this._doctorRepo.countUnverifiedDoctors();

    return { doctors, total };
  }
}
