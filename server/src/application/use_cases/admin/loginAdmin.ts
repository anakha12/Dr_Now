import jwt from "jsonwebtoken";
import { UserRepository } from "../../../domain/repositories/userRepository";
import bcrypt from "bcrypt";

export class LoginAdmin {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.findByEmail(email);
   
    if (!user) throw new Error("User not found");
    if (!user.isVerified) throw new Error("Please verify your email/OTP before logging in");
    if(!user.password){
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    console.log("User role:", user.role); 
 
    if (user.role !== "admin") throw new Error("Not an admin");


    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token, user };
  }
}