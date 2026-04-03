import { UserListItemDTO } from "../../../interfaces/dto/response/admin/get-all-users.response.dto";
import { UserEntity } from "../../../domain/entities/userEntity"; 

export class UserMapper {

  static toUserListDTO(users: UserEntity[]): UserListItemDTO[] {
    return users.map((user) => ({
      id: user.id ?? "",
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
  }
}