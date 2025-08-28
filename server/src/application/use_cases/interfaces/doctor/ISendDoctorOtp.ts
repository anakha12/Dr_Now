import { DoctorRegisterDTO } from "../../../../interfaces/dto/request/DoctorRegisterDTO"

export interface ISendDoctorOtp {
  execute(dto: DoctorRegisterDTO): Promise<void>;
}
