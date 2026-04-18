import { DepartmentResponseDTO } from "../../../../interfaces/dto/response/admin/department-response.dto";
import { EditDepartmentDTO } from "../../../../interfaces/dto/request/edit-department-admin.dto";

export interface IEditDepartmentUseCase {
  execute(id: string, data: EditDepartmentDTO): Promise<DepartmentResponseDTO>;
}
