import { IUserRepository } from "../../../domain/repositories/userRepository";
import { IVerifyUserOtp } from "../interfaces/user/IVerifyUserOtp";

import { getOTP, deleteOTP } from "../../../services/otpService";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class VerifyUserOtp implements IVerifyUserOtp{
  constructor(private _userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<string> {

    const user = await this._userRepository.findByEmail(email);
    
    if (!user) throw new Error( ErrorMessages.USER_NOT_FOUND);
    
    if (user.isVerified) throw new Error( Messages.USER_VERIFIED_ALREADY);

    const storedOtp=await getOTP(email);

    if(!storedOtp) throw new Error( ErrorMessages.OTP_NOT_FOUND);

    if(storedOtp !== otp) throw new Error( ErrorMessages.INVALID_OTP);
    await deleteOTP(email);

    await this._userRepository.updateUser(user.id!, {
      isVerified: true
    });

    return Messages.OTP_VERIFIED;
  }
}
