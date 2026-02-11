import bcrypt from "bcrypt";
import { ILoginAdmin } from "../interfaces/admin/ILoginAdmin";
import { AdminLoginDTO } from "../../../interfaces/dto/request/admin-login.dto";
import { AdminLoginResponseDTO } from "../../../interfaces/dto/response/admin/login-response.dto";
import { ITokenService } from "../../../interfaces/tokenServiceInterface";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { ErrorMessages } from "../../../utils/Messages";
import { BaseUseCase } from "../base-usecase";
import { plainToInstance } from "class-transformer";

export class LoginAdmin
  extends BaseUseCase<AdminLoginDTO, AdminLoginResponseDTO>
  implements ILoginAdmin
{
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _tokenService: ITokenService
  ) {
    super();
  }

  async execute(dto: AdminLoginDTO): Promise<AdminLoginResponseDTO> {
    
    const validatedDto  = await this.validateDto(AdminLoginDTO, dto);

    
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) throw new Error(ErrorMessages.USER_NOT_FOUND);
    if (!user.isVerified) throw new Error(ErrorMessages.EMAIL_NOT_VERIFIED);
    if (!user.password) throw new Error(ErrorMessages.INVALID_CREDENTIALS);

   
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

    
    return plainToInstance(AdminLoginResponseDTO, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
}
