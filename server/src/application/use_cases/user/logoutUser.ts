import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IUserLogout } from "../interfaces/user/IUserLogout";

export class LogoutUserUseCase implements IUserLogout {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<{ message: string }> {
    return { message: "Logout successful" };
  }
}
