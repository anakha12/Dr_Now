import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";


export class GetDepartmentsUser {
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(page: number, limit: number): Promise<DepartmentEntity[]> {
    return await this._departmentRepo.getDepartments(page, limit);
  }
}