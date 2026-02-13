import { BaseUseCase } from "../base-usecase";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { GoogleLoginRequestDTO } from "../../../interfaces/dto/request/google-login.dto";
import { GoogleLoginUserResponseDTO } from "../../../interfaces/dto/response/user/google-login-user.dto";
import { plainToInstance } from "class-transformer";
import jwt from "jsonwebtoken";
import { IGoogleLoginUser } from "../interfaces/user/IGoogleLoginUser";

interface CreateUserDTO {
  email: string;
  uid: string;
  name?: string;
  password: string;
}

export class GoogleLoginUser
  extends BaseUseCase<GoogleLoginRequestDTO, GoogleLoginUserResponseDTO>
  implements IGoogleLoginUser
{
  constructor(private _userRepository: IUserRepository) {
    super();
  }

  async execute(dto: GoogleLoginRequestDTO): Promise<GoogleLoginUserResponseDTO> {
    const validatedDto = await this.validateDto(GoogleLoginRequestDTO, dto);

   
    let user = await this._userRepository.findByEmailOrUid(validatedDto.email, validatedDto.uid);

   
    if (!user) {
      const createDto: CreateUserDTO = {
        email: validatedDto.email,
        uid: validatedDto.uid,
        name: validatedDto.name,
        password: "", 
      };

      user = await this._userRepository.createUser(createDto);
    } else {
     
      if (!user.uid) {
        await this._userRepository.updateUserByEmail(user.email, { uid: validatedDto.uid });
      }
    }

    
    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const response = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    return plainToInstance(GoogleLoginUserResponseDTO, response);
  }
}
