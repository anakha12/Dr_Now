import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import { IResetPassword } from "../interfaces/user/IResetPassword";
import { ErrorMessages } from "../../../utils/Messages";

export class ResetPassword implements IResetPassword{
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user || !user.otp || !user.otpExpiresAt) {
      throw new Error( ErrorMessages.OTP_NOT_FOUND);
    }

    if (user.otp !== otp || new Date(user.otpExpiresAt) < new Date()) {
      throw new Error( ErrorMessages.OTP_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this._userRepository.updateUserByEmail(email, {
      password: hashedPassword,
      otp: undefined,
      otpExpiresAt: undefined,
    });
  }
}
