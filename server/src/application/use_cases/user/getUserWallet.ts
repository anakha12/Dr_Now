import { UserRepository } from "../../../domain/repositories/userRepository";

export class GetUserWalletUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    return {
      walletBalance: user.walletBalance || 0,
      walletTransactions: user.walletTransactions || [],
    };
  }
}
