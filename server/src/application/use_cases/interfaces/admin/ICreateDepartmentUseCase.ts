import { DepartmentRegisterDTO } from "../../../../interfaces/dto/request/department-register.dto";
import { DepartmentResponseDTO } from "../../../../interfaces/dto/response/admin/department-response.dto";

export interface ICreateDepartmentUseCase {
  execute(dto: DepartmentRegisterDTO): Promise<DepartmentResponseDTO>;
}
