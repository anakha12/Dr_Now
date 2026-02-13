// src/use-cases/doctor/get-doctor-profile.ts
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { Messages } from "../../../utils/Messages";
import { IGetDoctorProfile } from "../interfaces/doctor/IGetDoctorProfile";
import { DoctorProfileResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-profile-response.dto";
import { plainToInstance } from "class-transformer";

export class GetDoctorProfile implements IGetDoctorProfile {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(id: string): Promise<DoctorProfileResponseDTO> {
    const doctor = await this._doctorRepository.findById(id);

    if (!doctor) throw new Error(Messages.DOCTOR_NOT_FOUND);
    
    return plainToInstance(DoctorProfileResponseDTO, doctor, {
      excludeExtraneousValues: true, 
    });
  }
}
