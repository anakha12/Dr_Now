export interface IBookWithWallet {
  execute(userId: string, doctorId: string, slot: { from: string; to: string }, amount: number, date: string): Promise<any>;
}
