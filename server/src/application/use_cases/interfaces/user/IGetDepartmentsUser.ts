import { DepartmentResponseDTO } from "../../../../interfaces/dto/response/user/department.dto";

export interface IGetDepartmentsUser {
  execute(page: number, limit: number): Promise<DepartmentResponseDTO[]>;
}
