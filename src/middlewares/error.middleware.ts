import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * @param error - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging purposes
  console.error('Error:', error);

  // Handle custom application errors with specific status codes
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Handle specific business logic errors

  // Email already exists during registration
  if (error.message === 'Email already used') {
    return res.status(409).json({
      message: error.message,
    });
  }

  // Authentication failed
  if (error.message === 'Invalid email or password') {
    return res.status(401).json({
      message: error.message,
    });
  }

  // Default to 500 server error for unknown errors
  res.status(500).json({
    message: 'Internal server error',
  });
};

/**
 * Async error handler wrapper
 * @param fn - Async function to wrap
 * @returns Wrapped function with error handling
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
