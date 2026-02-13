
import { RegisterUserRequestDTO } from "../../../../interfaces/dto/request/register-user.dto";
import { RegisterUserResponseDTO } from "../../../../interfaces/dto/response/user/register-user.dto";

export interface IRegisterUser {
  execute(dto: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO>;
}
