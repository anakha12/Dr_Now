import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";

export class GetAllDepartments {
  constructor(private _departmentRepository: IDepartmentRepository) {}

  async execute() {
   
    const all = await this._departmentRepository.getDepartments(1, 100); 
    return all.filter(dep => dep.status === "Listed");
  }
}
