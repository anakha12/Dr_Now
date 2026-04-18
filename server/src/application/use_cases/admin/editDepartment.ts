import { IDepartmentRepository } from "../../../domain/repositories/IDepartmentRepository";
import { IEditDepartmentUseCase } from "../interfaces/admin/IEditDepartmentUseCase";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/admin/department-response.dto";
import { EditDepartmentDTO } from "../../../interfaces/dto/request/edit-department-admin.dto";
import { Messages, ErrorMessages } from "../../../utils/Messages";
import { DepartmentAdminMapper } from "../../mappers/admin/department.mapper";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class EditDepartmentUseCase implements IEditDepartmentUseCase {
  constructor(private _departmentRepo: IDepartmentRepository) {}

  async execute(id: string, data: EditDepartmentDTO): Promise<DepartmentResponseDTO> {
    const validateDto = plainToInstance(EditDepartmentDTO, data);
    const errors = await validate(validateDto, { whitelist: true });
    
    if (errors.length > 0) {
      throw new Error("Validation failed");
    }

    if (validateDto.Departmentname) {
      const existing = await this._departmentRepo.findByName(validateDto.Departmentname);
      if (existing && existing.id !== id) {
        throw new Error(Messages.DEPARTMENT_ALREADY_EXISTS);
      }
    }

    const updatedEntity = await this._departmentRepo.updateDepartment(id, validateDto);
    if (!updatedEntity) {
      throw new Error(ErrorMessages.DEPARTMENT_NOT_FOUND);
    }

    return DepartmentAdminMapper.toResponseDTO(updatedEntity);
  }
}
