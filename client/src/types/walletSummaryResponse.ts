import type { WalletTransaction } from "../types/WalletTransaction";

export interface WalletSummaryResponse {
  walletBalance: number;
  transactions: WalletTransaction[];
  totalTransactions: number;
}
