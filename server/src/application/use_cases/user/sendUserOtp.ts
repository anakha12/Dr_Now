import { IUserRepository } from "../../../domain/repositories/userRepository";
import { sendMail } from "../../../services/mailService";
import { UserRegisterDTO } from "../../../interfaces/dto/request/UserRegisterDTO";
import { ISendUserOtp } from "../interfaces/user/ISendUserOtp";
import { redisClient } from "../../../config/redis";

export class SendUserOtp implements ISendUserOtp{
  constructor(private _userRepository: IUserRepository) {}

  async execute(dto: UserRegisterDTO): Promise<void> {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expireSeconds = 10 * 60
    
    console.log(`Generated OTP: ${otp}, Expires At: ${expireSeconds}`);

    const existingUser = await this._userRepository.findByEmail(dto.email);

    await redisClient.setEx(dto.email, expireSeconds, otp);

    if (existingUser) {
      await this._userRepository.updateUser(existingUser.id!, dto);
    } else {
      await this._userRepository.createUser(dto);
    }

    await sendMail(dto.email, "Your OTP Code", `Your OTP is: ${otp}`);
  }
}
