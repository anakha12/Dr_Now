import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IDepartmentRepository } from "../../../domain/repositories/departmentRepository";
export class GetFilteredDoctorsUseCase {
  constructor(
    private doctorRepository: IDoctorRepository,
    private departmentRepository: IDepartmentRepository
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
      this.doctorRepository.getFilteredDoctors(filters, skip, limit),
      this.doctorRepository.countFilteredDoctors(filters),
      this.departmentRepository.getDepartments(1, 100),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      doctors,
      specializations,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
      },
    };
  }
}

