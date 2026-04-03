
import { BaseUseCase } from "../base-usecase";
import { IGetDoctorAvailabilityExceptions } from "../interfaces/user/IGetDoctorAvailabilityExceptions";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { DoctorAvailabilityExceptionResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { plainToInstance } from "class-transformer";
import { GetDoctorBasicsDTO } from "../../../interfaces/dto/request/doctor-basic.dto";
import { DoctorAvailabilityExceptionMapper } from "../../mappers/doctor/doctor-availability-exception.mapper";


export class GetDoctorAvailabilityExceptionsUseCase
  extends BaseUseCase<GetDoctorBasicsDTO, DoctorAvailabilityExceptionResponseDTO[]>
  implements IGetDoctorAvailabilityExceptions
{
  constructor(private readonly _exceptionRepo: IDoctorAvailabilityExceptionRepository) {
    super();
  }

  async execute(dto: GetDoctorBasicsDTO): Promise<DoctorAvailabilityExceptionResponseDTO[]> {
   
    const validatedDto = await this.validateDto(GetDoctorBasicsDTO, dto);
    
    const exceptions = await this._exceptionRepo.getExceptionsForDoctor(validatedDto.doctorId);


    return DoctorAvailabilityExceptionMapper.toResponseDTO(exceptions);
  }
}