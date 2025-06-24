import { DepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";

export class CreateDepartmentUseCase {
  constructor(private departmentRepo: DepartmentRepository) {}

  async execute(data: DepartmentEntity): Promise<DepartmentEntity> {
    const existing = await this.departmentRepo.findByName(data.Departmentname);
    if (existing) {
      throw new Error("Department name already exists");
    }

    return await this.departmentRepo.createDepartment(data);
  }
}