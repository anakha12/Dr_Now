import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";


export class GetDepartmentsUseCase {
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(page: number, limit: number): Promise<{ departments: DepartmentEntity[], totalPages: number }> {
    return await this._departmentRepo.getPaginatedDepartments(page, limit);
  }
}