import { DepartmentEntity } from "../../domain/entities/department.entity";

export interface DepartmentRepository {
  createDepartment(data: DepartmentEntity): Promise<DepartmentEntity>;
  getDepartments(page: number, limit: number): Promise<DepartmentEntity[]>;
  toggleDepartmentStatus(id: string, status: 'Listed' | 'Unlisted'): Promise<void>;
  findByName(name: string): Promise<DepartmentEntity | null>;
}
