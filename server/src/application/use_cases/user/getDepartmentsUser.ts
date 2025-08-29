import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { DepartmentEntity } from "../../../domain/entities/department.entity";
import { plainToInstance } from "class-transformer";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/user/department.dto";


export class GetDepartmentsUser implements GetDepartmentsUser{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(page: number, limit: number): Promise<DepartmentResponseDTO[]> {

    const department = await this._departmentRepo.getDepartments(page, limit);
    
    return plainToInstance(DepartmentResponseDTO, department);
  }
}