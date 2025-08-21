import { IUserRepository } from "../../../domain/repositories/userRepository";
import { ISendResetOtp } from "../interfaces/user/ISendResetOtp";

export class SendResetOtp implements ISendResetOtp{
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this._userRepository.updateUserByEmail(email, {
      otp,
      otpExpiresAt,
    });

    console.log(`Reset OTP for ${email} is ${otp}`);

  }
}
