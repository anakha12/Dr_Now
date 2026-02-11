import { IUserRepository } from "../../../domain/repositories/userRepository";
import { GetAllUsersRequestDTO } from "../../../interfaces/dto/request/get-all-users.request.dto";
import { GetAllUsersResponseDTO, UserListItemDTO } from "../../../interfaces/dto/response/admin/get-all-users.response.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

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

    const users: UserListItemDTO[] = usersEntities.map((user) => ({
      id: user.id!,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
      isBlocked: user.isBlocked,
      dateOfBirth: user.dateOfBirth,
      image: user.image,
      profileCompletion: user.profileCompletion,
      bloodGroup: user.bloodGroup,
      address: user.address,
      isVerified: user.isVerified,
      role: user.role,
      walletBalance: user.walletBalance,
    }));

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
