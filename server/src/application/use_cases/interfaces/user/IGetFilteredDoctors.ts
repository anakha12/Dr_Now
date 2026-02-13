
import { GetFilteredDoctorsRequestDTO } from "../../../../interfaces/dto/request/filtered-doctor-user.dto";
import { DoctorListResponseDTO } from "../../../../interfaces/dto/response/user/doctor-list.dto"
import { DepartmentResponseDTO } from "../../../../interfaces/dto/response/admin/department-response.dto";

export interface IGetFilteredDoctors {
  execute(
    dto: GetFilteredDoctorsRequestDTO
  ): Promise<{
    doctors: DoctorListResponseDTO[];
    specializations: DepartmentResponseDTO[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }>;
}