// src/application/usecases/doctor/getDoctorAvailabilityExceptions.usecase.ts
import { BaseUseCase } from "../base-usecase";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { DoctorAvailabilityExceptionResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { plainToInstance } from "class-transformer";
import { IGetDoctorAvailabilityExceptions } from "../interfaces/doctor/IGetDoctorAvailabilityExceptions";
import { GetDoctorBasicsDTO } from "../../../interfaces/dto/request/doctor-basic.dto";

export class GetDoctorAvailabilityExceptionsUseCase
  extends BaseUseCase<GetDoctorBasicsDTO, DoctorAvailabilityExceptionResponseDTO[]>
  implements IGetDoctorAvailabilityExceptions
{
  constructor(private repo: IDoctorAvailabilityExceptionRepository) {
    super();
  }

  async execute(dto: GetDoctorBasicsDTO): Promise<DoctorAvailabilityExceptionResponseDTO[]> {

    await this.validateDto(GetDoctorBasicsDTO, dto);

    const exceptions = await this.repo.getExceptionsForDoctor(dto.doctorId);

    let va=exceptions.map((ex) =>
      plainToInstance(DoctorAvailabilityExceptionResponseDTO, ex, {
        excludeExtraneousValues: true,
      })
    );

    return exceptions.map((ex) =>
      plainToInstance(DoctorAvailabilityExceptionResponseDTO, ex, {
        excludeExtraneousValues: true,
      })
    );
  }
}
