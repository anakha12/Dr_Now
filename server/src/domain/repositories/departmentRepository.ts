import { DepartmentEntity } from "../../domain/entities/department.entity";

export interface IDepartmentRepository {
  createDepartment(data: DepartmentEntity): Promise<DepartmentEntity>;
  getDepartments(page: number, limit: number): Promise<DepartmentEntity[]>;
  toggleDepartmentStatus(id: string, status: 'Listed' | 'Unlisted'): Promise<void>;
  findByName(name: string): Promise<DepartmentEntity | null>;
  getPaginatedDepartments(page: number, limit: number): Promise<{ departments: DepartmentEntity[], totalPages: number }>

}
