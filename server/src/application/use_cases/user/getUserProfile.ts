// src/application/use_cases/user/getUserProfile.ts
import { plainToInstance } from "class-transformer";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IGetUserProfile } from "../interfaces/user/IGetUserProfile";
import { UserProfileResponseDTO } from "../../../interfaces/dto/response/user/user-profile.dto";

export class GetUserProfile implements IGetUserProfile{
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async execute(userId: string) {
    
    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    return plainToInstance( UserProfileResponseDTO, user);
  }
}
