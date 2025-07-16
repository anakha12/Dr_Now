import { IUserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import bcrypt from "bcrypt";

export class RegisterUser {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userData: UserEntity): Promise<UserEntity> {
    const { email, password } = userData;

    const existing = await this._userRepository.findByEmail(email);
    if (!existing) throw new Error("User not found");

    if (!password) throw new Error("Password is required");

    const hashedPassword = await bcrypt.hash(password, 10);


    const updatedUser = await this._userRepository.updateUserByEmail(email, {
      password: hashedPassword
    });

    return updatedUser;
  }
}
