import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { IGetAllDepartmentsUseCase } from "../interfaces/doctor/IGetAllDepartmentsUseCase";

export class GetAllDepartments implements IGetAllDepartmentsUseCase{
  constructor(private _departmentRepository: IDepartmentRepository) {}

  async execute() {
   
    const all = await this._departmentRepository.getDepartments(1, 100); 
    return all.filter(dep => dep.status === "Listed");
  }
}
