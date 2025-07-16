import { IUserRepository } from "../../../domain/repositories/userRepository";

export class VerifyUserOtp {
  constructor(private _userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<string> {
    const user = await this._userRepository.findByEmail(email);
    console.log(`Verifying OTP for user: ${email}, OTP: ${otp} and ${user}`);
    if (!user) throw new Error("User not found");
    console.log("Verifying OTP for user:", {
    email,
    otp,
    userOtp: user.otp,
    isVerified: user.isVerified,
    otpExpiresAt: user.otpExpiresAt,
    userObject: user,
  });
    if (user.isVerified) throw new Error("User already verified");

    if (user.otp !== otp) throw new Error("Invalid OTP");

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error("OTP expired");
    }

    await this._userRepository.updateUser(user.id!, {
      isVerified: true,
      otp: undefined,
      otpExpiresAt: undefined,
    });

    return "OTP verified successfully";
  }
}
