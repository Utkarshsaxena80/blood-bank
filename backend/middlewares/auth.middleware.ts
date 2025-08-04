import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.js";

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = verifyToken(token) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (token) {
      try {
        const decoded = verifyToken(token) as { userId: string };
        req.userId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we don't block the request
        console.log("Invalid token in optional auth:", error);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
};
