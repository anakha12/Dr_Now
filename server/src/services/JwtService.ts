import ms from "ms";
import { ITokenService } from "../interfaces/tokenServiceInterface";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

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

  verifyAccessToken(token: string): string | JwtPayload | null {
    try { return jwt.verify(token, this._accessSecret) as JwtPayload; } 
    catch { return null; }
  }

  verifyRefreshToken(token: string): string | JwtPayload | null {
    try { return jwt.verify(token, this._refreshSecret) as JwtPayload; } 
    catch { return null; }
  }

  decodeAccessToken(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload;
  }
}
