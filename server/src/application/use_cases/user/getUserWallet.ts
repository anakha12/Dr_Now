import { plainToInstance } from "class-transformer";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IGetUserWallet } from "../interfaces/user/IGetUserWallet";
import { UserWalletResponseDTO } from "../../../interfaces/dto/response/user/user-wallet.dto";

export class GetUserWalletUseCase implements IGetUserWallet{
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string, page: number, limit: number) {
    
    const user = await this._userRepository.getPaginatedWallet(userId, page, limit);
    if (!user) throw new Error("User not found");
    return plainToInstance( UserWalletResponseDTO, user);
  }
}
