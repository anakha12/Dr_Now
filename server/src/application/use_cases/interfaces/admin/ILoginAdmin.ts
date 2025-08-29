import { UserEntity } from "../../../../domain/entities/userEntity";
import { AdminLoginDTO } from "../../../../interfaces/dto/request/admin-login.dto";

export interface ILoginAdmin {
  execute( dto: AdminLoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity; 
  }>;
}
