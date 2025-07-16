// src/application/use_cases/user/getUserProfile.ts
import { IUserRepository } from "../../../domain/repositories/userRepository";

export class GetUserProfile {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }

  async execute(userId: string) {
    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userId:user.id,
    };
  }
}
