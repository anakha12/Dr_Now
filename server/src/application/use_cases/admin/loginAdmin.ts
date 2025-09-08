
import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import { ILoginAdmin } from "../interfaces/admin/ILoginAdmin";
import { AdminLoginDTO } from "../../../interfaces/dto/request/admin-login.dto";
import { ITokenService } from "../../../interfaces/tokenServiceInterface";

export class LoginAdmin implements ILoginAdmin{
  constructor(
    private _userRepository: IUserRepository,
    private _tokenService: ITokenService
  ) {}

  async execute(dto: AdminLoginDTO): Promise<{ accessToken: string;refreshToken:string;  user: any }> {

    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Please verify your email/OTP before logging in");
    if(!user.password){
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (user.role !== "admin") throw new Error("Not an admin");


    const accessToken = this._tokenService.generateAccessToken({
      id: user.id!,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this._tokenService.generateRefreshToken({
      id: user.id!,
      email: user.email,
      role: user.role,
    });

    return { accessToken, refreshToken, user };
  }
}