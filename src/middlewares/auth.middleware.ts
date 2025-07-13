import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { userService } from '../services/user.service';

/**
 * Extended Request interface to include user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

/**
 * JWT payload interface
 */
interface JWTPayload {
  userId: number;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate JWT token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract token from Authorization header (format: "Bearer TOKEN")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      message: 'Access token required',
    });
  }

  try {
    // Verify and decode JWT token using secret
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Find user by ID extracted from token payload
    const user = await userService.findUserById(decoded.userId);

    // Check if user still exists in database
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token - user not found',
      });
    }

    // Attach user information to request object for use in controllers
    req.user = {
      id: user.id,
      email: user.email,
    };

    // Continue to next middleware or controller
    next();
  } catch (error) {
    // Handle invalid, expired, or malformed tokens
    return res.status(403).json({
      message: 'Invalid or expired token',
    });
  }
};
