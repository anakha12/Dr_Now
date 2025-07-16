import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";

export class CreateDepartmentUseCase {
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(data: DepartmentEntity): Promise<DepartmentEntity> {
    const existing = await this._departmentRepo.findByName(data.Departmentname);
    if (existing) {
      throw new Error("Department name already exists");
    }

    return await this._departmentRepo.createDepartment(data);
  }
}