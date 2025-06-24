import { UserRepository } from "../../../domain/repositories/userRepository";
import { sendMail } from "../../../services/mailService";
import { UserRegisterDTO } from "../../dto/userRegister.dto";
import { UserEntity } from "../../../domain/entities/userEntity";

export class SendUserOtp {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: UserRegisterDTO): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    console.log(`Generated OTP: ${otp}, Expires At: ${otpExpiresAt}`);
    const existingUser = await this.userRepository.findByEmail(dto.email);
    const userEntity: Partial<UserEntity> = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      age: dto.age,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth,
      address: dto.address,
      bloodGroup: dto.bloodGroup,
      image: dto.image ?? "",
      isBlocked: false,
      isVerified: false,
      isDonner: dto.isDonner === "true" ? true : false,
      otp,
      otpExpiresAt,
    };

    if (existingUser) {
      await this.userRepository.updateUser(existingUser.id!, userEntity);
    } else {
      await this.userRepository.createUser(userEntity as UserEntity);
    }

    await sendMail(dto.email, "Your OTP Code", `Your OTP is: ${otp}`);
  }
}
