import { UserEntity } from "../../../../domain/entities/userEntity";

export interface IToggleUserBlockStatusUseCase {
  execute(userId: string, block: boolean): Promise<UserEntity>;
}
