import { DepartmentEntity } from "../../../../domain/entities/department.entity";

export interface IGetAllDepartmentsUseCase {
  execute(): Promise<DepartmentEntity[]>;
}
