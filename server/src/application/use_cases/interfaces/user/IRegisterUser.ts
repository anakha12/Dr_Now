import { UserEntity } from "../../../../domain/entities/userEntity";

export interface IRegisterUser {
  execute(userData: UserEntity): Promise<UserEntity>;
}
