import { Types } from "mongoose";

export interface WalletTransactionUser {
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  bookingId?: string;
  date: Date;
}
