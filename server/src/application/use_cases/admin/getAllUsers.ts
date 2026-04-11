import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetAllUsersRequestDTO } from "../../../interfaces/dto/request/get-all-users.request.dto";
import { GetAllUsersResponseDTO } from "../../../interfaces/dto/response/admin/get-all-users.response.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { UserMapper } from "../../mappers/admin/user.mapper";

export class GetAllUsersUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(input: Record<string, unknown>): Promise<GetAllUsersResponseDTO> {

    const dto = plainToInstance(GetAllUsersRequestDTO, input);
    await validateOrReject(dto, { whitelist: true });
    
    const skip = (dto.page - 1) * dto.limit;

    const sortOption = this.mapSort(dto.sort);

    const usersEntities = await this._userRepo.getFilteredUsers({
      search: dto.search,
      gender: dto.gender,
      minAge: dto.minAge,
      maxAge: dto.maxAge,
    }, skip, dto.limit, sortOption);

    const totalUsers = await this._userRepo.countFilteredUsers({
      search: dto.search,
      gender: dto.gender,
      minAge: dto.minAge,
      maxAge: dto.maxAge,
    });

    const users = UserMapper.toUserListDTO(usersEntities);

    return {
      users,
      totalPages: Math.ceil(totalUsers / dto.limit),
      currentPage: dto.page,
    };
  }

  private mapSort(sort?: string): Record<string, 1 | -1> {
    switch (sort) {
      case "NAME_ASC": return { name: 1 };
      case "NAME_DESC": return { name: -1 };
      case "AGE_ASC": return { age: 1 };
      case "AGE_DESC": return { age: -1 };
      case "REGISTERED_ASC": return { createdAt: 1 };
      case "REGISTERED_DESC": return { createdAt: -1 };
      default: return { createdAt: -1 };
    }
  }
}
