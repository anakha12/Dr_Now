import { Request, Response, NextFunction } from "express";
import {  getJwtService } from "../../di/adminDI"; 

export interface DecodedUser {
  id: string;
  email: string;
  role: "admin" | "user" | "doctor";
}

export interface AuthRequest extends Request {
  user?: DecodedUser;
}

export const verifyToken = (requiredRole: "admin" | "user" | "doctor") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token =
      requiredRole === "doctor"
        ? req.cookies?.accessToken
        : req.cookies?.userAccessToken;

    if (!token) return res.status(401).json({ message: "No token provided" });

    const jwtService = getJwtService();

    const decoded = jwtService.verifyAccessToken(token) as DecodedUser | null;
    if (!decoded) return res.status(401).json({ message: "Invalid or expired token" });

    if (decoded.role !== requiredRole) return res.status(403).json({ message: "Forbidden" });

    req.user = decoded;
    next();
  };
};
