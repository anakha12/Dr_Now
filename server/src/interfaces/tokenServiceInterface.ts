export interface ITokenService {
  generateAccessToken(payload: { id: string; email: string; role: string }): string;
  generateRefreshToken(payload: { id: string; email: string; role: string }): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
  decodeAccessToken(token: string): any;
}
