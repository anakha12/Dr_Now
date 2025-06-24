import { DepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";


export class GetDepartmentsUser {
  constructor(private departmentRepo: DepartmentRepository) {}

  async execute(page: number, limit: number): Promise<DepartmentEntity[]> {
    return await this.departmentRepo.getDepartments(page, limit);
  }
}