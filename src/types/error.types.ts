/**
 * Error handling types and classes for the Flowfig API
 */

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  /** HTTP status code */
  public statusCode: number;
  /** Flag to identify operational errors vs programming errors */
  public isOperational: boolean;

  /**
   * Create a new AppError instance
   * @param message - Error message
   * @param statusCode - HTTP status code
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common HTTP error status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error response structure for API responses
 */
export interface ErrorResponse {
  /** Error message */
  message: string;
  /** HTTP status code */
  statusCode: number;
  /** Additional error details (development only) */
  details?: unknown;
}
