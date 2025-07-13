import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Register a new user
 * @param req - Express request object containing validated user registration data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract validated email and password from request (validated by middleware)
    const { email, password } = req.body;

    // Register user through auth service
    const user = await authService.registerUser(email, password);

    // Return success response with user ID
    res.status(201).json({
      message: 'User created',
      userId: user.id,
    });
  }
);

/**
 * Login user with email and password
 * @param req - Express request object containing validated user login credentials
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with JWT token or error details
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract validated email and password from request (validated by middleware)
    const { email, password } = req.body;

    // Authenticate user and get JWT token
    const token = await authService.loginUser(email, password);

    // Return success response with JWT token
    res.status(200).json({ token });
  }
);
