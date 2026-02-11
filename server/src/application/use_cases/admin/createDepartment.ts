import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { ICreateDepartmentUseCase } from "../interfaces/admin/ICreateDepartmentUseCase";
import { DepartmentRegisterDTO } from "../../../interfaces/dto/request/department-register.dto";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/admin/department-response.dto";
import { Messages } from "../../../utils/Messages";
import { BaseUseCase } from "../base-usecase";
import { plainToInstance } from "class-transformer";

export class CreateDepartmentUseCase 
  extends BaseUseCase<DepartmentRegisterDTO, DepartmentResponseDTO>
  implements ICreateDepartmentUseCase
  {
  constructor(private _departmentRepo: IDepartmentRepository) {
    super()
  }

  async execute(data: DepartmentRegisterDTO): Promise<DepartmentResponseDTO> {

    const validateDto = await this.validateDto(DepartmentRegisterDTO,data)

    const existing = await this._departmentRepo.findByName(validateDto.Departmentname);
    if (existing) {
      throw new Error(Messages.DEPARTMENT_ALREADY_EXISTS);
    }

   const deptEntity = await this._departmentRepo.createDepartment(validateDto);
   const responseDto = plainToInstance(DepartmentResponseDTO, {
      id: deptEntity.id?.toString() || "", 
      Departmentname: deptEntity.Departmentname,
      Description: deptEntity.Description || "",
    });
    return responseDto;
  }
}