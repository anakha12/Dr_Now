import { Request, Response } from "express";
import { TokenService } from "../../infrastructure/services/TokenService";

export class AuthController {
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.accessToken;
      if (!token) throw new Error("Token missing");

      const decoded = TokenService.verify(token); // uses our TokenService
      const newToken = TokenService.sign(decoded); // uses our TokenService

      res.cookie("accessToken", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Token refreshed" });
    } catch (err: any) {
      console.error("Refresh token error:", err.message);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  }
}
