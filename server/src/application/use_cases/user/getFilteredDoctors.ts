import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
import { IGetFilteredDoctors } from "../interfaces/user/IGetFilteredDoctors";
import { plainToInstance } from "class-transformer";
import { DoctorListResponseDTO } from "../../../interfaces/dto/response/user/doctor-list.dto";
export class GetFilteredDoctorsUseCase implements IGetFilteredDoctors{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _departmentRepository: IDepartmentRepository
  ) {}

  async execute(filters: {
    search?: string;
    specialization?: string;
    maxFee?: number;
    gender?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 6;
    const skip = (page - 1) * limit;

    const [doctors, totalCount, specializations] = await Promise.all([
      this._doctorRepository.getFilteredDoctors(filters, skip, limit),
      this._doctorRepository.countFilteredDoctors(filters),
      this._departmentRepository.getDepartments(1, 100),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
   
    const doctorDTOs=plainToInstance(DoctorListResponseDTO, doctors)
   
    return {
      doctors : doctorDTOs,
      specializations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
    };
  }
}

