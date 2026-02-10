import { WalletSummaryResponseDTO } from "../../../../interfaces/dto/response/admin/wallet-summary-response.dto";

export interface IGetWalletSummaryUseCase {
  execute(): Promise<WalletSummaryResponseDTO>;
}
