import { DepartmentRepository } from "../../../domain/repositories/departmentRepository";

export class GetAllDepartments {
  constructor(private departmentRepository: DepartmentRepository) {}

  async execute() {
   
    const all = await this.departmentRepository.getDepartments(1, 100); 
    return all.filter(dep => dep.status === "Listed");
  }
}
