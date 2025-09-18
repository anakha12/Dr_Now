
import { DoctorAvailabilityExceptionResponseDTO } from "../../../../interfaces/dto/response/doctor/doctor-exception-response.dto";
import { GetDoctorBasicsDTO } from "../../../../interfaces/dto/request/doctor-basic.dto";

export interface IGetDoctorAvailabilityExceptions {
  execute(dto: GetDoctorBasicsDTO): Promise<DoctorAvailabilityExceptionResponseDTO[]>;
}

