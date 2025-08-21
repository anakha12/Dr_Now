import jwt from "jsonwebtoken";
import { IUserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";
import { ILoginAdmin } from "../interfaces/admin/ILoginAdmin";

export class LoginAdmin implements ILoginAdmin{
  constructor(private _userRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ accessToken: string;refreshToken:string;  user: any }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Please verify your email/OTP before logging in");
    if(!user.password){
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

 
    if (user.role !== "admin") throw new Error("Not an admin");


    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
 

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET!, 
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken, user };
  }
}