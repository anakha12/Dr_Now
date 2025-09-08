import { Request, Response } from "express";
import { ITokenService } from "../tokenServiceInterface";
import { Messages } from "../../utils/Messages";
import { HttpStatus } from "../../utils/HttpStatus";

export class AuthController {
  private readonly _tokenService: ITokenService;
  private readonly _cookieName: string;

  constructor(tokenService: ITokenService, cookieName: string) {
    this._tokenService = tokenService;
    this._cookieName = cookieName;
  }

async refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies?.[this._cookieName];
    if (!token) throw new Error(Messages.TOKEN_MISSING);

    // Use new method
    const decoded = this._tokenService.verifyRefreshToken(token);
    if (!decoded) throw new Error(Messages.INVALID_OR_EXPIRED_TOKEN);

    const { exp, iat, ...payloadWithoutExp } = decoded;

    const refreshToken = this._tokenService.generateRefreshToken(payloadWithoutExp); 
    const accessToken = this._tokenService.generateAccessToken(payloadWithoutExp);

    // Set cookies
    res.cookie(this._cookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("userAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({
      message: Messages.TOKEN_REFRESHED,
    });
  } catch (err: any) {
    console.error("Refresh token error:", err.message);
    res.status(HttpStatus.UNAUTHORIZED).json({ error: Messages.INVALID_OR_EXPIRED_TOKEN });
  }
}



}
