import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IVerifyUserOtp } from "../interfaces/user/IVerifyUserOtp";

import { getOTP, deleteOTP } from "../../../services/otpService";

export class VerifyUserOtp implements IVerifyUserOtp{
  constructor(private _userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<string> {

    const user = await this._userRepository.findByEmail(email);
    
    if (!user) throw new Error("User not found");
    
    if (user.isVerified) throw new Error("User already verified");

    const storedOtp=await getOTP(email);

    if(!storedOtp) throw new Error("Otp expired or Not found");

    if(storedOtp !== otp) throw new Error("Invalid OTP");

    await deleteOTP(email);

    await this._userRepository.updateUser(user.id!, {
      isVerified: true
    });

    return "OTP verified successfully";
  }
}
