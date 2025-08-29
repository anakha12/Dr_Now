
import { DepartmentEntity } from "../../../../domain/entities/department.entity";
import { DoctorListResponseDTO } from "../../../../interfaces/dto/response/user/doctor-details.dto";

export interface IGetFilteredDoctors {
  execute(filters: {
    search?: string;
    specialization?: string;
    maxFee?: number;
    gender?: string;
    page: number;
    limit: number;
  }): Promise<{
    doctors: DoctorListResponseDTO[];
    specializations: DepartmentEntity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }>;
}
