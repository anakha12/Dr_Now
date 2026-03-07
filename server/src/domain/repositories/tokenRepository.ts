import { JwtPayload } from "../../utils/types/jwt";

export interface ITokenService {
  sign(payload: string | object): string;
  signRefresh(payload: string | object): string;
  verifyAccess(token: string): JwtPayload;
  verifyRefresh(token: string): JwtPayload;
}