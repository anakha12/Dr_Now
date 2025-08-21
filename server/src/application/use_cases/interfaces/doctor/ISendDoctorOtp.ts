import { DoctorRegisterDTO } from "../../../dto/doctorRegister.dto";

export interface ISendDoctorOtp {
  execute(dto: DoctorRegisterDTO): Promise<void>;
}
