import { Request, Response, NextFunction } from "express";
import {  getJwtService } from "../../di/adminDI"; 
import { Messages } from "../../utils/Messages";
import { HttpStatus } from "../../utils/HttpStatus";
import { Role } from "../../utils/Constance";
export interface DecodedUser {
  id: string;
  email: string;
  role: Role.ADMIN | Role.USER | Role.DOCTOR;
}

export interface AuthRequest extends Request {
  user?: DecodedUser;
}

export const verifyToken = (requiredRole: Role.ADMIN | Role.USER | Role.DOCTOR) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      requiredRole ===  Role.DOCTOR
        ? req.cookies?.accessToken
        : req.cookies?.userAccessToken;
        
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.TOKEN_MISSING });

    const jwtService = getJwtService();

    const decoded = jwtService.verifyAccessToken(token) as DecodedUser | null;
    if (!decoded) return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.INVALID_OR_EXPIRED_TOKEN });

    if (decoded.role !== requiredRole) return res.status(403).json({ message: Messages.FORBIDDEN_ERROR });
    req.user = decoded;
    next();
  };
};
