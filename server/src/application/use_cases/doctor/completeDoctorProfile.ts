import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { Messages } from "../../../utils/Messages";
import { ICompleteDoctorProfile } from "../interfaces/doctor/ICompleteDoctorProfile";
import { CompleteDoctorProfileRequestDTO } from "../../../interfaces/dto/request/complete-doctor-profile-request.dto";
import { CompleteDoctorProfileResponseDTO } from "../../../interfaces/dto/response/doctor/complete-doctor-profile.dto";
import { plainToInstance } from "class-transformer";

export class CompleteDoctorProfile implements ICompleteDoctorProfile {

  constructor(private readonly _doctorRepo: IDoctorRepository) {}

  async execute(
    doctorId: string,
    profileData: CompleteDoctorProfileRequestDTO
  ): Promise<CompleteDoctorProfileResponseDTO> {

    if (!doctorId) {
      throw new Error(Messages.DOCTOR_ID_REQUIRED);
    }

    const doctor = await this._doctorRepo.completeProfile(doctorId, profileData);

    return plainToInstance(CompleteDoctorProfileResponseDTO, doctor);
  }
}