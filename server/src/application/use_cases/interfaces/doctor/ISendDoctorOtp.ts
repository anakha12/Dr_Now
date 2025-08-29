import { DoctorRegisterDTO } from "../../../../interfaces/dto/request/doctor-register.dto."

export interface ISendDoctorOtp {
  execute(dto: DoctorRegisterDTO): Promise<void>;
}
