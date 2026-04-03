import { UpdateUserProfileRequestDTO } from "../../../interfaces/dto/request/update-user-profile.dto";
import { UpdateUserProfileResponseDTO } from "../../../interfaces/dto/response/user/update-user-profile.dto";
import { UserEntity } from "../../../domain/entities/userEntity";


type UpdateUserData = Record<string, unknown>;

export class UpdateUserProfileMapper {


  static toUpdateData(
    dto: UpdateUserProfileRequestDTO,
    existingUser: UserEntity
  ): UpdateUserData {

    const isFirstCompletion =
      !existingUser.profileCompletion &&
      dto.name &&
      dto.email &&
      dto.phone &&
      dto.dateOfBirth &&
      dto.gender &&
      dto.bloodGroup &&
      dto.address &&
      dto.image;

    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      address: dto.address,
      image: dto.image,
      profileCompletion: isFirstCompletion
        ? true
        : existingUser.profileCompletion,
      age: dto.age !== undefined ? Number(dto.age) : undefined,
      dateOfBirth: dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : undefined,
    };
  }

  // ✅ Entity → Response DTO
  static toResponseDTO(user: UserEntity): UpdateUserProfileResponseDTO {
    return {
      id: user.id ?? "",
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth
        ? (user.dateOfBirth as Date).toISOString()
        : undefined,
      gender: user.gender,
      bloodGroup: user.bloodGroup,
      address: user.address,
      image: user.image,
      age: user.age !== undefined ? Number(user.age) : undefined,
      profileCompletion: user.profileCompletion,
    };
  }
}