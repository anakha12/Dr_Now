import { GoogleLoginUserResponseDTO } from "../../../../interfaces/dto/response/user/google-login-user.dto";

export interface IGoogleLoginUser {
  execute(data: { email: string; name?: string; uid: string }): Promise<GoogleLoginUserResponseDTO>;
}