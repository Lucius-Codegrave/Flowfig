import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import logger from '../logger';

/**
 * Custom error class for application errors
 * This class extends the built-in Error class to include additional properties.
 */
export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error details for debugging
  logger.error('Error:', error);

  // Check if response object is valid
  if (!res || typeof res.status !== 'function') {
    logger.error('Invalid response object in error handler');
    return;
  }

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
  return res.status(500).json({
    message: 'Internal server error',
  });
};

/**
 * Async error handler wrapper (generic version)
 * @param fn - Async function to wrap
 * @returns Wrapped function with error handling
 */
export const asyncHandler = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void> | void
) => {
  return (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
