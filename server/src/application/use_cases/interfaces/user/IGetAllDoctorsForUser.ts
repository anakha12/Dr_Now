import { DoctorListResponseDTO } from "../../../../interfaces/dto/response/user/doctor-details.dto";

export interface IGetAllDoctorsForUser {
  execute(): Promise<DoctorListResponseDTO[]>;
}
