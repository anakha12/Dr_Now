import { GetDepartmentsRequestDTO } from "../../../../interfaces/dto/request/get-departments-admin.dto";
import { GetDepartmentsResponseDTO } from "../../../../interfaces/dto/response/admin/get-departments.dto";

export interface IGetDepartmentsUseCase {
  execute(dto: GetDepartmentsRequestDTO): Promise<GetDepartmentsResponseDTO>;
}