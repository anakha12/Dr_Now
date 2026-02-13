import { plainToInstance } from "class-transformer";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IGetUserWallet } from "../interfaces/user/IGetUserWallet";
import { UserWalletResponseDTO } from "../../../interfaces/dto/response/user/user-wallet.dto";
import { ErrorMessages } from "../../../utils/Messages";

export class GetUserWalletUseCase implements IGetUserWallet{
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<UserWalletResponseDTO> {
    
    const user = await this._userRepository.getPaginatedWallet(userId, page, limit);
    if (!user) throw new Error( ErrorMessages.USER_NOT_FOUND);
    return plainToInstance( UserWalletResponseDTO, user);
  }
}
