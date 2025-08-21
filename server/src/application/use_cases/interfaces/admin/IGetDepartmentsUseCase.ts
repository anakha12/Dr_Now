import { DepartmentEntity } from "../../../../domain/entities/department.entity";

export interface IGetDepartmentsUseCase {
  execute(
    page: number,
    limit: number,
    search: string
  ): Promise<{
    departments: DepartmentEntity[];
    totalPages: number;
  }>;
}