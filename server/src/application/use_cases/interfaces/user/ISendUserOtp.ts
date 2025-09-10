import { UserRegisterDTO } from "../../../../interfaces/dto/request/user-register.dto";

export interface ISendUserOtp {
  execute(dto: UserRegisterDTO): Promise<{ email: string}>;
}
