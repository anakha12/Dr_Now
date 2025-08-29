import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { DoctorEntity } from "../../../domain/entities/doctorEntity";
import { IGetAllDoctorsUseCase } from "../interfaces/admin/IGetAllDoctors";
import { plainToInstance } from "class-transformer";

export class GetAllDoctors implements IGetAllDoctorsUseCase{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(page: number, limit: number, search: string): Promise<{ doctors: DoctorEntity[]; totalDoctors: number }> {
    const skip = (page - 1) * limit;

    const doctors = await this._doctorRepo.getPaginatedDoctors(skip, limit, search);
    const totalDoctors = await this._doctorRepo.countDoctors(); 
    //  const responseDto = plainToInstance(DepartmentResponseDTO, doctors, {
    //   excludeExtraneousValues: true,
    // });
    return { doctors, totalDoctors };
  }
}
