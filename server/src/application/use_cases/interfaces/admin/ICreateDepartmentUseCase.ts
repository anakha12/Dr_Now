import { DepartmentEntity } from "../../../../domain/entities/department.entity";

export interface ICreateDepartmentUseCase {
  execute(data: DepartmentEntity): Promise<DepartmentEntity>;
}