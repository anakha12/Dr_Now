// application/usecases/admin/getAllUsers.ts

import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";

export class GetAllUsersUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(page: number, limit: number): Promise<{
    users: UserEntity[];
    totalPages: number;
  }> {
    return await this._userRepository.getPaginatedUsers(page, limit);
  }
}
