export interface ISendResetOtp {
  execute(email: string): Promise<void>;
}
