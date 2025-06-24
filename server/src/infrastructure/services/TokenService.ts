import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin" | "doctor";
}

export class TokenService {
  static verify(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  }

  static sign(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
  }
}
