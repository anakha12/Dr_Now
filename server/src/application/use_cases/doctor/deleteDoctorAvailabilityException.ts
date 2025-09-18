
import { BaseUseCase } from "../base-usecase";
import { DeleteDoctorAvailabilityExceptionDTO  } from "../../../interfaces/dto/request/delete-doctor-availability-exception.dto";
import { IDoctorAvailabilityExceptionRepository } from "../../../domain/repositories/IDoctorAvailabilityExceptionRepository ";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";

export class DeleteDoctorAvailabilityExceptionUseCase
  extends BaseUseCase<DeleteDoctorAvailabilityExceptionDTO , { message: string }>
{
  constructor(private repo: IDoctorAvailabilityExceptionRepository) {
    super();
  }

  async execute(input: DeleteDoctorAvailabilityExceptionDTO ): Promise<{ message: string }> {
    const dto = plainToInstance(DeleteDoctorAvailabilityExceptionDTO , input);
    await validateOrReject(dto);

    const deleted = await this.repo.deleteException(dto.exceptionId);
    if (!deleted) throw new Error("Exception not found");

    return { message: "Availability exception deleted successfully" };
  }
}
