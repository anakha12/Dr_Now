export interface IVerifyUserOtp {
  execute(email: string, otp: string): Promise<string>;
}
