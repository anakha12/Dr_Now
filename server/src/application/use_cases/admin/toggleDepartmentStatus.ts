import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { IToggleDepartmentStatusUseCase } from "../interfaces/admin/IToggleDepartmentStatusUseCase";


export class ToggleDepartmentStatusUseCase implements IToggleDepartmentStatusUseCase{
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(id: string, status: 'Listed' | 'Unlisted'): Promise<void> {
    return await this._departmentRepo.toggleDepartmentStatus(id, status);
  }
}