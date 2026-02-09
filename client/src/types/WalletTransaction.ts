
export interface WalletTransaction {
  _id: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  reason: string; 
}
