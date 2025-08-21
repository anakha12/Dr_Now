// application/usecases/admin/getAllUsers.ts

import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import { IGetAllUsersUseCase } from "../interfaces/admin/IGetAllUsers";

export class GetAllUsersUseCase implements IGetAllUsersUseCase{
  constructor(private _userRepository: IUserRepository) {}

  async execute(page: number, limit: number, search: string): Promise<{
    users: UserEntity[];
    totalPages: number;
  }> {
    return await this._userRepository.getPaginatedUsers(page, limit, search);
  }
}
