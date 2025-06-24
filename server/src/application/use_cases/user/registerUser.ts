import { UserRepository } from "../../../domain/repositories/userRepository";
import { UserEntity } from "../../../domain/entities/userEntity";
import bcrypt from "bcrypt";

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: UserEntity): Promise<UserEntity> {
    const { email, password } = userData;

    const existing = await this.userRepository.findByEmail(email);
    if (!existing) throw new Error("User not found");

    if (!password) throw new Error("Password is required");

    const hashedPassword = await bcrypt.hash(password, 10);


    const updatedUser = await this.userRepository.updateUserByEmail(email, {
      password: hashedPassword
    });

    return updatedUser;
  }
}
