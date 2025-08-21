import { DoctorEntity } from "../../../../domain/entities/doctorEntity";
import { DepartmentEntity } from "../../../../domain/entities/department.entity";

export interface IGetFilteredDoctors {
  execute(filters: {
    search?: string;
    specialization?: string;
    maxFee?: number;
    gender?: string;
    page: number;
    limit: number;
  }): Promise<{
    doctors: DoctorEntity[];
    specializations: DepartmentEntity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }>;
}
