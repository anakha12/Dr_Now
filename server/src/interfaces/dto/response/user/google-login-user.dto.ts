
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
  token!: string;

  @Expose()
  @Type(() => UserDTO)
  user!: UserDTO;
}
