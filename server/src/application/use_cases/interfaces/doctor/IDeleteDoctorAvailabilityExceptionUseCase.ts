import { DeleteDoctorAvailabilityExceptionDTO } from "../../../../interfaces/dto/request/delete-doctor-availability-exception.dto";

export interface IDeleteDoctorAvailabilityExceptionUseCase {
  execute(dto: DeleteDoctorAvailabilityExceptionDTO): Promise<{ message: string }>;
}
