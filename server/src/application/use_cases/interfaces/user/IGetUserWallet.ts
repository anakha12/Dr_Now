import { UserWalletResponseDTO } from "../../../../interfaces/dto/response/user/user-wallet.dto";

export interface IGetUserWallet {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<UserWalletResponseDTO>;
}