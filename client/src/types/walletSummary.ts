export interface WalletSummary {
  _id: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  description?: string;
}