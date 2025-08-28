import { UserLoginDTO } from "../../../../interfaces/dto/request/UserLoginDTO";

export interface ILoginUser {
  execute(dto:UserLoginDTO): Promise<{ token: string; user: any }>;
}
