import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { IGetFilteredDoctors } from "../interfaces/user/IGetFilteredDoctors";
import { plainToInstance } from "class-transformer";
import { DoctorListResponseDTO } from "../../../interfaces/dto/response/user/doctor-list.dto";
import { GetFilteredDoctorsRequestDTO } from "../../../interfaces/dto/request/filtered-doctor-user.dto";
import { DepartmentResponseDTO  } from "../../../interfaces/dto/response/user/department.dto";
import { BaseUseCase } from "../base-usecase";


export class GetFilteredDoctorsUseCase
  extends BaseUseCase<
    GetFilteredDoctorsRequestDTO,
    {
      doctors: DoctorListResponseDTO[];
      specializations: DepartmentResponseDTO[];
      pagination: { currentPage: number; totalPages: number; totalItems: number };
    }
  >
  implements IGetFilteredDoctors
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _departmentRepository: IDepartmentRepository
  ) {
    super()
  }

  async execute(
    dto: GetFilteredDoctorsRequestDTO
  ): Promise<{
    doctors: DoctorListResponseDTO[];
    specializations: DepartmentResponseDTO[];
    pagination: { currentPage: number; totalPages: number; totalItems: number };
  }> {
   
    const filters = await this.validateDto(GetFilteredDoctorsRequestDTO, dto);

    const skip = (filters.page - 1) * filters.limit;

   
    const [doctors, totalCount, specializations] = await Promise.all([
      this._doctorRepository.getFilteredDoctors(filters, skip, filters.limit, { createdAt: -1 }),
      this._doctorRepository.countFilteredDoctors(filters),
      this._departmentRepository.getDepartments(1, 100),
    ]);

    const totalPages = Math.ceil(totalCount / filters.limit);

  
    const doctorDTOs = plainToInstance(DoctorListResponseDTO, doctors);
    const departmentDTOs = plainToInstance(DepartmentResponseDTO, specializations);

    return {
      doctors: doctorDTOs,
      specializations: departmentDTOs,
      pagination: {
        currentPage: filters.page,
        totalPages,
        totalItems: totalCount,
      },
    };
  }
}