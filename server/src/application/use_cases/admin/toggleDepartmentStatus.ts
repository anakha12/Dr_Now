import { DepartmentRepository } from "../../../domain/repositories/departmentRepository";


export class ToggleDepartmentStatusUseCase {
  constructor(private departmentRepo: DepartmentRepository) {}

  async execute(id: string, status: 'Listed' | 'Unlisted'): Promise<void> {
    return await this.departmentRepo.toggleDepartmentStatus(id, status);
  }
}