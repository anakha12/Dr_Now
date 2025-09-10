import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import { ILoginUser } from "../interfaces/user/ILoginUser";
import { UserLoginDTO } from "../../../interfaces/dto/request/user-login.dto";
import { ITokenService } from "../../../interfaces/tokenServiceInterface";
import { BaseUseCase } from "../base-usecase";
import { UserLoginResponseDTO } from "../../../interfaces/dto/response/user/login-response.dto";
import { plainToInstance } from "class-transformer";

export class LoginUser extends 
  BaseUseCase <UserLoginDTO, { accessToken: string; refreshToken: string; user: UserLoginResponseDTO }> implements ILoginUser{
  
  constructor(
    private _userRepository: IUserRepository,
    private _tokenService: ITokenService
  ) {
    super();
  }

  async execute(data: UserLoginDTO): Promise<{ accessToken: string; refreshToken: string; user: UserLoginResponseDTO }> {
    const dto= await this.validateDto(UserLoginDTO, data)

    const user = await this._userRepository.findByEmail(dto.email);

    if (!user) throw new Error("User not found");

    if (!user.isVerified) throw new Error("Please verify your email/OTP before logging in");
    if(!user.password) throw new Error("Please verify your email/OTP before logging in");

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

  
    const accessToken = this._tokenService.generateAccessToken(
      { id: user.id!, email: user.email, role: user.role },
      
    );

    const refreshToken = this._tokenService.generateRefreshToken(
      { id: user.id!, email: user.email, role: user.role },
      
    );

     const userDto= plainToInstance( UserLoginResponseDTO,{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
      })

    return { accessToken, refreshToken, user:userDto };
  }
}