
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetAllDoctorsForUser } from "../interfaces/user/IGetAllDoctorsForUser";
import { plainToInstance } from "class-transformer";
import { DoctorListResponseDTO } from "../../../interfaces/dto/response/user/doctor-list.dto";

export class GetAllDoctorsForUser implements IGetAllDoctorsForUser{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(): Promise<DoctorListResponseDTO[]> {
    const doctor=await this._doctorRepo.getAllDoctors();
    
    const filteredDoctors = doctor.filter(
      (doc)=>doc.isVerified && !doc.isBlocked && !doc.isRejected
    )

    return plainToInstance(DoctorListResponseDTO, filteredDoctors,{
      excludeExtraneousValues: true,
    })
  }
}
