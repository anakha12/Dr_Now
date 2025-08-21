export interface ICreateStripeSession {
  execute(doctorId: string, userId: string, slot: { from: string; to: string }, fee: number, date: string): Promise<{ sessionId: string }>;
}
