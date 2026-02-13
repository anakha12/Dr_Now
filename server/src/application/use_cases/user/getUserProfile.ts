import { plainToInstance } from "class-transformer";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IGetUserProfile } from "../interfaces/user/IGetUserProfile";
import { BasicUserProfileResponseDTO } from "../../../interfaces/dto/response/user/basic-user-profile.dto";
import { FullUserProfileResponseDTO } from "../../../interfaces/dto/response/user/full-user-profile.dto";
import { ErrorMessages } from "../../../utils/Messages";

export class GetUserProfile implements IGetUserProfile {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    userId: string
  ): Promise<FullUserProfileResponseDTO | BasicUserProfileResponseDTO> {
    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);

    if (user.profileCompletion) {
      return plainToInstance(FullUserProfileResponseDTO, user);
    } else {
      return plainToInstance(BasicUserProfileResponseDTO, user);
    }
  }
}
