export interface ITokenService {
  sign(payload: string | object): string;
  signRefresh(payload: string | object): string;
  verifyAccess(token: string): any;
  verifyRefresh(token: string): any;
}