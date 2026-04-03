import { DepartmentEntity } from "../../../../domain/entities/departmentEntity";

export interface IGetAllDepartmentsUseCase {
  execute(): Promise<DepartmentEntity[]>;
}
