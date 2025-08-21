export interface IVerifyDoctorOtp {
  execute(email: string, otp: string): Promise<string>;
}