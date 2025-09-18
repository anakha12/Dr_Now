import { AddDoctorAvailabilityExceptionDTO } from "../../../interfaces/dto/request/add-doctor-exception.dto";
import { DoctorAvailabilityException } from "../../../domain/entities/doctorAvailabilityException.entity";
import { DoctorAvailabilityExceptionResponseDTO } from "../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { plainToInstance } from "class-transformer";
import { BaseUseCase } from "../base-usecase";
import { IAddDoctorAvailabilityException } from "../interfaces/doctor/IAddDoctorAvailabilityException";

export class AddDoctorAvailabilityExceptionUseCase
  extends BaseUseCase<AddDoctorAvailabilityExceptionDTO, DoctorAvailabilityExceptionResponseDTO>
  implements IAddDoctorAvailabilityException
{
  constructor(private repo: IDoctorAvailabilityExceptionRepository) {
    super();
  }

  async execute(
    data: AddDoctorAvailabilityExceptionDTO
  ): Promise<DoctorAvailabilityExceptionResponseDTO> {

    const dto = await this.validateDto(AddDoctorAvailabilityExceptionDTO, data);

    const exception = new DoctorAvailabilityException(
      dto.doctorId,
      dto.date,
      dto.isAvailable,
      dto.startTime,
      dto.endTime,
      dto.slotDuration
    );

    const saved = await this.repo.createException(exception);

    return plainToInstance(DoctorAvailabilityExceptionResponseDTO, saved, {
      excludeExtraneousValues: true,
    });
  }
}
