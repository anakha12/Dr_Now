import { UserEntity } from "../../../../domain/entities/userEntity";

export interface ILoginAdmin {
  execute(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity; 
  }>;
}
