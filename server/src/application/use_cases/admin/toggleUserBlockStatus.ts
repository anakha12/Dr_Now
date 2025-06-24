// application/usecases/admin/toggleUserBlockStatus.ts

import { UserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";

export class ToggleUserBlockStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, block: boolean): Promise<UserEntity> {
    return await this.userRepository.toggleBlockStatus(userId, block);
  }
}
