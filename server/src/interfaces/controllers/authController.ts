import { Request, Response } from "express";
import { ITokenService } from "../../domain/repositories/tokenRepository";
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
    console.log("refresh");
    const token = req.cookies?.[this._cookieName];
    console.log("token", token);
    if (!token) throw new Error(Messages.TOKEN_MISSING);

    const decoded = this._tokenService.verifyRefresh(token);
    console.log("decoded", decoded);
    const { exp, iat, ...payloadWithoutExp } = decoded;

    const refreshToken = this._tokenService.signRefresh(payloadWithoutExp); // refresh token
    const accessToken = this._tokenService.sign(payloadWithoutExp);         // access token
console.log("token",this._cookieName)
    // Set refresh token in its cookie
    res.cookie(this._cookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Set user access token in userAccessToken cookie
    res.cookie("userAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60 * 1000, // 30 mins
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
