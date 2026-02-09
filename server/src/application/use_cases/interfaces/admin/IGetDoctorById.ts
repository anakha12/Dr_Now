import { DoctorDetailsResponseDTO } from "../../../../interfaces/dto/response/admin/doctor-details.dto";

export interface IGetDoctorByIdUseCase {
  execute(id: string): Promise<DoctorDetailsResponseDTO>;
}
