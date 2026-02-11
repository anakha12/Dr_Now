
import { IGetAllDoctorsUseCase } from "../interfaces/admin/IGetAllDoctors";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { GetAllDoctorsDTO } from "../../../interfaces/dto/request/get-all-doctor-admin.dto";
import { DoctorResponseDTO } from "../../../interfaces/dto/response/admin/get-all-doctor.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { DoctorStatus, DoctorSort } from "../../../utils/Constance";

export class GetAllDoctors implements IGetAllDoctorsUseCase {
  constructor(private readonly _doctorRepo: IDoctorRepository) {}

  async execute(input: Record<string, unknown>): Promise<{
    doctors: DoctorResponseDTO[];
    totalPages: number;
    currentPage: number;
  }> {
   
    const dto = plainToInstance(GetAllDoctorsDTO, input);
    await validateOrReject(dto, { whitelist: true });

    const skip = (dto.page - 1) * dto.limit;

    
    const filters: Record<string, unknown> = {};
    if (dto.search) filters.search = dto.search;
    if (dto.specialization) filters.specialization = dto.specialization;
    if (dto.status) filters.isBlocked = dto.status === DoctorStatus.BLOCKED;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (dto.sort === DoctorSort.NAME_ASC) sortOption = { name: 1 };
    else if (dto.sort === DoctorSort.NAME_DESC) sortOption = { name: -1 };
    else if (dto.sort === DoctorSort.DATE_ASC ) sortOption = { createdAt: 1 };
    else if (dto.sort === DoctorSort.DATE_DESC) sortOption = { createdAt: -1 };

    filters.sort = sortOption;

    
    const doctorsEntities = await this._doctorRepo.getFilteredDoctors(filters, skip, dto.limit, sortOption);
    const totalDoctors = await this._doctorRepo.countFilteredDoctors(filters);

    const doctors = doctorsEntities.map((doc) =>
      plainToInstance(DoctorResponseDTO, {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        yearsOfExperience: doc.yearsOfExperience,
        specialization: doc.specialization,
        profileImage: doc.profileImage,
        gender: doc.gender,
        consultFee: doc.consultFee,
        isBlocked: doc.isBlocked,
        isVerified: doc.isVerified,
        role: doc.role,
        age: doc.age,
      })
    );

    return {
      doctors,
      totalPages: Math.ceil(totalDoctors / dto.limit),
      currentPage: dto.page,
    };
  }
}
