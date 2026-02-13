
import { DoctorProfileResponseDTO } from "../../../../interfaces/dto/response/doctor/doctor-profile-response.dto";

export interface IGetDoctorProfile {
  execute(id: string): Promise<DoctorProfileResponseDTO>;
}
