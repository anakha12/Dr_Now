import { IUserRepository } from "../../../domain/repositories/userRepository";
import jwt from "jsonwebtoken";
import { UserEntity } from "../../../domain/entities/userEntity";


interface GoogleUserPayload {
  email: string;
  name?: string;
  uid: string;
}

export class GoogleLoginUser {
  constructor(private _userRepository: IUserRepository) {}

  async execute(googleUser: GoogleUserPayload): Promise<{ token: string; user: any }> {
    let user = await this._userRepository.findByEmail(googleUser.email);

    if (!user) {
      user = await this._userRepository.createUser({
        email: googleUser.email,
        uid: googleUser.uid,
        name: googleUser.name,
        password: "", 
        } as UserEntity);
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });


    return { token, user: { email: user.email, id: user.id, name: user.name } };
  }
}
