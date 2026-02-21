import { Socket } from "socket.io";
import { getJwtService } from "../../di/adminDI";
import cookie from "cookie";
  
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Authentication error"));
    }

    const parsedCookies = cookie.parse(cookies);

    const token =
      parsedCookies.accessToken || parsedCookies.userAccessToken;

    if (!token) {
      return next(new Error("Token missing"));
    }

    const jwtService = getJwtService();
    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    socket.data.user = decoded; 

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};
