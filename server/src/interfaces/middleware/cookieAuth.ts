import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const cookieAuth = (requiredRole: "admin" | "user" | "doctor") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // use 'accessToken' for doctor, 'userAccessToken' for user/admin
    const token =
      requiredRole === "doctor"
        ? req.cookies?.accessToken
        : req.cookies?.userAccessToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        email: string;
        role: string;
      };

      if (decoded.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient role" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token" });
    }
  };
};
