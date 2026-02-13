// src/application/usecases/user/register-user.usecase.ts
import { BaseUseCase } from "../base-usecase";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import { RegisterUserRequestDTO } from "../../../interfaces/dto/request/register-user.dto";
import { RegisterUserResponseDTO } from "../../../interfaces/dto/response/user/register-user.dto";
import { plainToInstance } from "class-transformer";
import bcrypt from "bcrypt";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class RegisterUser extends BaseUseCase<
  RegisterUserRequestDTO,
  RegisterUserResponseDTO
> {
  constructor(private _userRepository: IUserRepository) {
    super();
  }

  async execute(dto: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {

    const validatedDto = await this.validateDto(RegisterUserRequestDTO, dto);

    const { email, password } = validatedDto;


    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser) throw new Error(ErrorMessages.USER_NOT_FOUND);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._userRepository.updateUserByEmail(email, { password: hashedPassword });

    const response = { message: Messages.USER_REGISTERED_SUCCESSFULLY };
    return plainToInstance(RegisterUserResponseDTO, response);
  }
}
