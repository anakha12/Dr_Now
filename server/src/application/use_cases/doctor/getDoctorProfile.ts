import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { Messages } from "../../../utils/Messages";
import { IGetDoctorProfile } from "../interfaces/doctor/IGetDoctorProfile";

export class GetDoctorProfile implements IGetDoctorProfile{
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(id: string) {
    const doctor = await this._doctorRepository.findById(id);
    
    if (!doctor) throw new Error( Messages.DOCTOR_NOT_FOUND);
    return doctor;
  }
}
