import { Exclude, Expose, Type } from "class-transformer";
import { UserLoginResponseDTO } from "../user/login-response.dto";

@Exclude()
export class AdminLoginResponseDTO {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  @Expose()
  @Type(() => UserLoginResponseDTO)
  user!: UserLoginResponseDTO;
}
