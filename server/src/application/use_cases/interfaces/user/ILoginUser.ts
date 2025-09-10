import { UserLoginDTO } from "../../../../interfaces/dto/request/user-login.dto";
import { UserLoginResponseDTO } from "../../../../interfaces/dto/response/user/login-response.dto";

export interface ILoginUser {
  execute(dto:UserLoginDTO): Promise<{ accessToken: string; refreshToken: string; user: UserLoginResponseDTO }>;
}
