import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IGetUserWallet } from "../interfaces/user/IGetUserWallet";

export class GetUserWalletUseCase implements IGetUserWallet{
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string, page: number, limit: number) {
    const user = await this._userRepository.getPaginatedWallet(userId, page, limit);
    if (!user) throw new Error("User not found");
    console.log(user)
    return {
      walletBalance: user.walletBalance || 0,
      walletTransactions: user.walletTransactions || [],
      totalTransactions: user.totalTransactions || 0,
    };
  }
}
