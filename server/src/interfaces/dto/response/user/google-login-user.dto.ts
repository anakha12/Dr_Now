
import { Expose, Type } from "class-transformer";

class UserDTO {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  name?: string;
}

export class GoogleLoginUserResponseDTO {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;

  @Expose()
  @Type(() => UserDTO)
  user!: UserDTO;
}