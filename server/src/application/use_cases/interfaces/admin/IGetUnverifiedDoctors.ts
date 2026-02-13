import { GetUnverifiedDoctorsResponseDTO } from "../../../../interfaces/dto/response/admin/unverified-doctor-response.dto";

export interface IGetUnverifiedDoctors {
  execute(page: number, limit: number): Promise<GetUnverifiedDoctorsResponseDTO>;
}
