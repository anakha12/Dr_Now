import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";

export class ResetPassword {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user || !user.otp || !user.otpExpiresAt) {
      throw new Error("OTP not requested or expired");
    }

    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this._userRepository.updateUserByEmail(email, {
      password: hashedPassword,
      otp: undefined,
      otpExpiresAt: undefined,
    });
  }
}
