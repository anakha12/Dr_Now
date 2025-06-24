// src/application/use_cases/user/getUserProfile.ts
import { UserRepository } from "../../../domain/repositories/userRepository";

export class GetUserProfile {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userId:user.id,
    };
  }
}
