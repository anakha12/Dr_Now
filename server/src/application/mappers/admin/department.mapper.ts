import { DepartmentEntity } from "../../../domain/entities/departmentEntity";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/admin/department-response.dto";
import { plainToInstance } from "class-transformer";

export class DepartmentAdminMapper {
  static toResponseDTO(department: DepartmentEntity): DepartmentResponseDTO {
    return plainToInstance(DepartmentResponseDTO, {
      id: department.id,
      Departmentname: department.Departmentname,
      Description: department.Description || "",
    });
  }
}
