import { UserRegisterDTO } from "../../../dto/userRegister.dto";

export interface ISendUserOtp {
  execute(dto: UserRegisterDTO): Promise<void>;
}
