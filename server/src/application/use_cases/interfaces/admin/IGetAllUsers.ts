import { UserEntity } from "../../../../domain/entities/userEntity";

export interface IGetAllUsersUseCase {
  execute(
    page: number,
    limit: number,
    search: string
  ): Promise<{
    users: UserEntity[];
    totalPages: number;
  }>;
}