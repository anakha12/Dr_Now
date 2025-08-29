import { plainToInstance } from "class-transformer";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorById } from "../interfaces/user/IGetDoctorById";
import { DoctorDetailsResponseDTO } from "../../../interfaces/dto/response/user/doctor-details.dto";

export class GetDoctorById implements IGetDoctorById{
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(id: string) {
    
    const doctorDetails = await this._doctorRepo.findById(id);
    
    return plainToInstance( DoctorDetailsResponseDTO, doctorDetails);
  }
}
