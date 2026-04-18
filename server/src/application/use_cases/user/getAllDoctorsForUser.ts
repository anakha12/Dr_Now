
import { IDoctorRepository } from "../../../domain/repositories/IDoctorRepository";
import { IGetAllDoctorsForUser } from "../interfaces/user/IGetAllDoctorsForUser";
import { plainToInstance } from "class-transformer";
import { DoctorDetailsResponseDTO } from "../../../interfaces/dto/response/user/doctor-details.dto";

export class GetAllDoctorsForUser implements IGetAllDoctorsForUser{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(): Promise<DoctorDetailsResponseDTO[]> {
    const doctor=await this._doctorRepo.getAllDoctors();
    
    const filteredDoctors = doctor.filter(
      (doc)=>doc.isVerified && !doc.isBlocked && !doc.isRejected
    )

    return plainToInstance(DoctorDetailsResponseDTO, filteredDoctors,{
      excludeExtraneousValues: true,
    })
  }
}
