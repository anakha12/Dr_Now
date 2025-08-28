import { UserRegisterDTO } from "../../../../interfaces/dto/request/UserRegisterDTO";

export interface ISendUserOtp {
  execute(dto: UserRegisterDTO): Promise<void>;
}
