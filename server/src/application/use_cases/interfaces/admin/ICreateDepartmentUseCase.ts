import { DepartmentEntity } from "../../../../domain/entities/department.entity";
import { DepartmentRegisterDTO } from "../../../../interfaces/dto/request/department-register.dto";

export interface ICreateDepartmentUseCase {
  execute(dto: DepartmentRegisterDTO): Promise<DepartmentEntity>;
}