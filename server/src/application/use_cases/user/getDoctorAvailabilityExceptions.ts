
import { BaseUseCase } from "../base-usecase";
import { IGetDoctorAvailabilityExceptions } from "../interfaces/user/IGetDoctorAvailabilityExceptions";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { DoctorAvailabilityExceptionResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { plainToInstance } from "class-transformer";
import { GetDoctorBasicsDTO } from "../../../interfaces/dto/request/doctor-basic.dto";
import { ErrorMessages } from "../../../utils/Messages";


export class GetDoctorAvailabilityExceptionsUseCase
  extends BaseUseCase<GetDoctorBasicsDTO, DoctorAvailabilityExceptionResponseDTO[]>
  implements IGetDoctorAvailabilityExceptions
{
  constructor(private readonly _exceptionRepo: IDoctorAvailabilityExceptionRepository) {
    super();
  }

  async execute(dto: GetDoctorBasicsDTO): Promise<DoctorAvailabilityExceptionResponseDTO[]> {
     console.log("Received DTO:", dto);
    const validatedDto = await this.validateDto(GetDoctorBasicsDTO, dto);
    
    const exceptions = await this._exceptionRepo.getExceptionsForDoctor(validatedDto.doctorId);


    const plainExceptions = exceptions.map((ex) => ({
       _id: ex._id ? String(ex._id) : "",
      doctorId: ex.doctorId,
      date: ex.date,
      isAvailable: ex.isAvailable,
      startTime: ex.startTime,
      endTime: ex.endTime,
      slotDuration: ex.slotDuration,
    }));
 
    const result = plainToInstance(DoctorAvailabilityExceptionResponseDTO, plainExceptions, {
      excludeExtraneousValues: true,
    });

    return result;
  }
}
