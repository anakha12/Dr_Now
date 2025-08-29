import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserEntity } from "../../../domain/entities/userEntity";
import { ILoginUser } from "../interfaces/user/ILoginUser";
import { UserLoginDTO } from "../../../interfaces/dto/request/user-login.dto";

export class LoginUser implements ILoginUser{
  
  constructor(private _userRepository: IUserRepository) {}

  async execute(dto: UserLoginDTO): Promise<{ token: string; user: UserEntity }> {

    const user = await this._userRepository.findByEmail(dto.email);

    if (!user) throw new Error("User not found");

    if (!user.isVerified) throw new Error("Please verify your email/OTP before logging in");
    if(!user.password) throw new Error("Please verify your email/OTP before logging in");

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

  
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token, user };
  }
}