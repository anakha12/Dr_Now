
import { DoctorResponseDTO } from "../../../../interfaces/dto/response/admin/get-all-doctor.dto";

export interface IGetAllDoctorsUseCase {
  execute(query: unknown): Promise<{
    doctors: DoctorResponseDTO[];
    totalPages: number;
    currentPage: number;
  }>;
}
