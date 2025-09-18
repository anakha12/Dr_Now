import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import bcrypt from "bcrypt";
import { IRegisterUser } from "../interfaces/user/IRegisterUser";
import { ErrorMessages, Messages } from "../../../utils/Messages";

export class RegisterUser implements IRegisterUser{
  constructor(private _userRepository: IUserRepository) {}

  async execute(userData: UserEntity): Promise<UserEntity> {
    const { email, password } = userData;

    const existing = await this._userRepository.findByEmail(email);
    if (!existing) throw new Error( ErrorMessages.USER_NOT_FOUND);

    if (!password) throw new Error( Messages.PASSWORD_REQUIRED);

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await this._userRepository.updateUserByEmail(email, {
      password: hashedPassword
    });

    return updatedUser;
  }
}
