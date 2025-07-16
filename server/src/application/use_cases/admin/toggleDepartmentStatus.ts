import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";


export class ToggleDepartmentStatusUseCase {
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(id: string, status: 'Listed' | 'Unlisted'): Promise<void> {
    return await this._departmentRepo.toggleDepartmentStatus(id, status);
  }
}