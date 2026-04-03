import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { plainToInstance } from "class-transformer";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/user/department.dto";
import { IGetDepartmentsUser } from "../interfaces/user/IGetDepartmentsUser";


export class GetDepartmentsUser implements IGetDepartmentsUser{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(page: number, limit: number): Promise<DepartmentResponseDTO[]> {

    const department = await this._departmentRepo.getDepartments(page, limit);
    
    return plainToInstance(DepartmentResponseDTO, department);
  }
}