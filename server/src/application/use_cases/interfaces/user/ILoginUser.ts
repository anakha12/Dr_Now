import { UserLoginDTO } from "../../../../interfaces/dto/request/user-login.dto";

export interface ILoginUser {
  execute(dto:UserLoginDTO): Promise<{ token: string; user: any }>;
}
