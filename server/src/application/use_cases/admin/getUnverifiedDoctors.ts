import { IDoctorRepository } from "../../../domain/repositories/doctorRepository";
import { IGetUnverifiedDoctors } from "../interfaces/admin/IGetUnverifiedDoctors"; 
import { UnverifiedDoctorResponseDTO } from "../../../interfaces/dto/response/admin/unverified-doctor-response.dto";
import { GetUnverifiedDoctorsResponseDTO } from "../../../interfaces/dto/response/admin/unverified-doctor-response.dto";
import { plainToInstance } from "class-transformer";

export class GetUnverifiedDoctors implements IGetUnverifiedDoctors {
  constructor(private _doctorRepo: IDoctorRepository) {}

  async execute(page: number, limit: number): Promise<GetUnverifiedDoctorsResponseDTO> {
    const skip = (page - 1) * limit;


    const doctorsRaw = await this._doctorRepo.getUnverifiedDoctorsPaginated(skip, limit);
    const total = await this._doctorRepo.countUnverifiedDoctors();


    const doctorsDto: UnverifiedDoctorResponseDTO[] = doctorsRaw.map(doc =>
      plainToInstance(UnverifiedDoctorResponseDTO, {
        id: doc.id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        specialization: doc.specialization,
      })
    );


    return plainToInstance(GetUnverifiedDoctorsResponseDTO, {
      doctors: doctorsDto,
      total,
    });
  }
}
