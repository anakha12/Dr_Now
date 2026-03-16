import ms from "ms";
import { ITokenService } from "../interfaces/tokenServiceInterface";
import jwt, { Secret } from "jsonwebtoken";
import { JwtPayload } from "../utils/types/jwt";

export class JwtService implements ITokenService {
  private _accessSecret: Secret;
  private _refreshSecret: Secret;
  private _accessExpiresIn: string;
  private _refreshExpiresIn: string;

  constructor() {
    this._accessSecret = process.env.JWT_SECRET as Secret;
    this._refreshSecret = process.env.JWT_REFRESH_SECRET as Secret;
    this._accessExpiresIn = process.env.JWT_ACCESS_EXPIRES || "1d";
    this._refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES || "7d";
  }

  generateAccessToken(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, this._accessSecret, { expiresIn: this._accessExpiresIn as ms.StringValue });
  }

  generateRefreshToken(payload: { id: string; email: string; role: string }): string {
    return jwt.sign(payload, this._refreshSecret, { expiresIn: this._refreshExpiresIn as ms.StringValue });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this._accessSecret);
      return decoded as JwtPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this._refreshSecret);
      return decoded as JwtPayload;
    } catch {
      return null;
    }
  }

  decodeAccessToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload;
  }
}
