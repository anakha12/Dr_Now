import { CompleteDoctorProfileRequestDTO } from "../../../../interfaces/dto/request/complete-doctor-profile-request.dto";
import { CompleteDoctorProfileResponseDTO } from "../../../../interfaces/dto/response/doctor/complete-doctor-profile.dto";

export interface ICompleteDoctorProfile {
  execute(
    doctorId: string,
    profileData: CompleteDoctorProfileRequestDTO
  ): Promise<CompleteDoctorProfileResponseDTO>;
}