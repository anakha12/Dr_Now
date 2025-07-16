import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/repositories/tokenRepository";

export class TokenService implements ITokenService {
  sign(payload: string | object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "30s" }); 
  }

  signRefresh(payload: string | object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  }

  verifyAccess(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!); 
  }

  verifyRefresh(token: string): any {
    console.log("REFRESH SECRET:", process.env.JWT_REFRESH_SECRET);

    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!); 
  }
}
