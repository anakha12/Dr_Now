

import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";

export class ToggleUserBlockStatusUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string, block: boolean): Promise<UserEntity> {
    return await this._userRepository.toggleBlockStatus(userId, block);
  }
}
