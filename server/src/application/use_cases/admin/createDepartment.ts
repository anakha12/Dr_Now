import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";
import { ICreateDepartmentUseCase } from "../interfaces/admin/ICreateDepartmentUseCase";
import { DepartmentRegisterDTO } from "../../../interfaces/dto/request/department-register.dto";
import { Messages } from "../../../utils/Messages";

export class CreateDepartmentUseCase implements ICreateDepartmentUseCase{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(dto: DepartmentRegisterDTO): Promise<DepartmentEntity> {
    const existing = await this._departmentRepo.findByName(dto.Departmentname);
    if (existing) {
      throw new Error(Messages.DEPARTMENT_ALREADY_EXISTS);
    }

    return await this._departmentRepo.createDepartment(dto);
  }
}