import { IUserRepository } from "../../../domain/repositories/userRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { ISendResetOtp } from "../interfaces/user/ISendResetOtp";

export class SendResetOtp implements ISendResetOtp{
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error( ErrorMessages.USER_NOT_FOUND);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this._userRepository.updateUserByEmail(email, {
      otp,
      otpExpiresAt,
    });

  }
}
