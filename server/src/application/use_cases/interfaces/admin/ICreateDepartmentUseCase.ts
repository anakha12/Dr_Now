import { DepartmentEntity } from "../../../../domain/entities/department.entity";
import { DepartmentRegisterDTO } from "../../../../interfaces/dto/request/DepartmentRegisterDTO ";

export interface ICreateDepartmentUseCase {
  execute(dto: DepartmentRegisterDTO): Promise<DepartmentEntity>;
}