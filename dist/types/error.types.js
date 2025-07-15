"use strict";
/**
 * Error handling types and classes for the Flowfig API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.AppError = void 0;
/**
 * Custom error class for application errors
 */
class AppError extends Error {
    /**
     * Create a new AppError instance
     * @param message - Error message
     * @param statusCode - HTTP status code
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Common HTTP error status codes
 */
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
