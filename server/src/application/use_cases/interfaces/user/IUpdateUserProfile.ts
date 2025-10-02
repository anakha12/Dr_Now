import { UpdateUserProfileDto } from "../../../../interfaces/dto/response/user/updateUserProfile.dto";
import { UserEntity } from "../../../../domain/entities/userEntity";

export interface IUpdateUserProfileUseCase {
  execute(userId: string, data: UpdateUserProfileDto): Promise<UserEntity>;
}



