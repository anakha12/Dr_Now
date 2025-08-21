import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";
import { IGetDepartmentsUseCase } from "../interfaces/admin/IGetDepartmentsUseCase";


export class GetDepartmentsUseCase implements IGetDepartmentsUseCase{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(page: number, limit: number, search: string): Promise<{ departments: DepartmentEntity[], totalPages: number }> {
    return await this._departmentRepo.getPaginatedDepartments(page, limit, search);
  }
}