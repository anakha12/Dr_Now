import { DoctorDetailsResponseDTO } from "../../../../interfaces/dto/response/user/doctor-details.dto";

export interface IGetDoctorById {
  execute(doctorId: string): Promise<DoctorDetailsResponseDTO | null>;
}