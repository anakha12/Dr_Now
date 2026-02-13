import { BaseUseCase } from "../base-usecase";
import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { GetDepartmentsRequestDTO } from "../../../interfaces/dto/request/get-departments-admin.dto";
import { GetDepartmentsResponseDTO } from "../../../interfaces/dto/response/admin/get-departments.dto";
import { DepartmentResponseDTO } from "../../../interfaces/dto/response/admin/department-response.dto";
import { plainToInstance } from "class-transformer";

export class GetDepartmentsUseCase extends BaseUseCase<
  GetDepartmentsRequestDTO,
  GetDepartmentsResponseDTO
> {
  constructor(private _departmentRepo: IDepartmentRepository) {
    super();
  }

  async execute(dto: GetDepartmentsRequestDTO): Promise<GetDepartmentsResponseDTO> {

    const validatedDto = await this.validateDto(GetDepartmentsRequestDTO, dto);


    const { departments, totalPages } = await this._departmentRepo.getPaginatedDepartments(
      validatedDto.page,
      validatedDto.limit,
      validatedDto.search || ""
    );


    const departmentsDto: DepartmentResponseDTO[] = departments.map(dep =>
      plainToInstance(DepartmentResponseDTO, {
        id: dep.id,
        Departmentname: dep.Departmentname || dep.Description || "",
        Description: dep.Description || "",
      })
    );

    return plainToInstance(GetDepartmentsResponseDTO, {
      departments: departmentsDto,
      totalPages,
    });
  }
}
