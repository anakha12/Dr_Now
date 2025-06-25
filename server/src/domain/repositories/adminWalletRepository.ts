import { AdminWalletTransaction } from "../entities/adminWalletEntity";

export interface AdminWalletRepository {
  creditCommission(transaction: AdminWalletTransaction, amount: number): Promise<void>;
  getSummary(): Promise<{ totalBalance: number; transactionCount: number }>;
  createTransaction(transaction: AdminWalletTransaction): Promise<void>;
  debitCommission(transaction: AdminWalletTransaction, amount: number): Promise<void>;

}
