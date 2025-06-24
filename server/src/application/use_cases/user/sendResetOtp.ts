import { UserRepository } from "../../../domain/repositories/userRepository";

export class SendResetOtp {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await this.userRepository.updateUserByEmail(email, {
      otp,
      otpExpiresAt,
    });

    console.log(`Reset OTP for ${email} is ${otp}`);
    // In production: integrate nodemailer here
  }
}
