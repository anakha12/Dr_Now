export interface AdminWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  doctorId?: string;
  userId?: string;
  bookingId?: string;
  description: string;
  date?: Date;
}

export interface AdminWallet {
  totalBalance: number;
  transactions: AdminWalletTransaction[];
}
