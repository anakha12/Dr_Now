// middleware/verifyToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (allowedRole: "admin" | "user" | "doctor") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.userAccessToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        email: string;
        role: string;
      };

      if (decoded.role !== allowedRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
