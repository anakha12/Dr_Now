export interface Transaction {
  type: "credit" | "debit";
  amount: number;
  reason: string;
  bookingId?: string;
  date: string;
}