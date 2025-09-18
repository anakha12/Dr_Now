
import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import { ILoginAdmin } from "../interfaces/admin/ILoginAdmin";
import { AdminLoginDTO } from "../../../interfaces/dto/request/admin-login.dto";
import { ITokenService } from "../../../interfaces/tokenServiceInterface";
import { ErrorMessages } from "../../../utils/Messages";

export class LoginAdmin implements ILoginAdmin{
  constructor(
    private _userRepository: IUserRepository,
    private _tokenService: ITokenService
  ) {}

  async execute(dto: AdminLoginDTO): Promise<{ accessToken: string;refreshToken:string;  user: any }> {

    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);
    if (!user.isVerified) throw new Error(ErrorMessages.EMAIL_NOT_VERIFIED);
    if(!user.password){
      throw new Error(ErrorMessages.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new Error(ErrorMessages.INVALID_CREDENTIALS);

    if (user.role !== "admin") throw new Error(ErrorMessages.NOT_AN_ADMIN);


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