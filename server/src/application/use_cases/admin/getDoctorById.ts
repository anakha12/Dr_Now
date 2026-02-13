import { plainToInstance } from "class-transformer";
import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetDoctorByIdUseCase } from "../interfaces/admin/IGetDoctorById";
import { DoctorDetailsResponseDTO } from "../../../interfaces/dto/response/admin/doctor-details.dto";
import { Messages } from "../../../utils/Messages";

export class GetDoctorByIdUseCase implements IGetDoctorByIdUseCase {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(id: string): Promise<DoctorDetailsResponseDTO> {
    const doctor = await this._doctorRepo.getDoctorById(id);
    if (!doctor) throw new Error( Messages.DOCTOR_NOT_FOUND);


    return plainToInstance(DoctorDetailsResponseDTO, doctor, { excludeExtraneousValues: true });
  }
}
