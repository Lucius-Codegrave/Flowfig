"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const types_1 = require("../types");
const logger_1 = __importDefault(require("../logger"));
/**
 * Custom error class for application errors
 * This class extends the built-in Error class to include additional properties.
 */
const errorHandler = (error, _req, res, _next) => {
    // Log the error details for debugging
    logger_1.default.error('Error:', error);
    // Check if response object is valid
    if (!res || typeof res.status !== 'function') {
        logger_1.default.error('Invalid response object in error handler');
        return;
    }
    // Handle custom application errors with specific status codes
    if (error instanceof types_1.AppError) {
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
exports.errorHandler = errorHandler;
/**
 * Async error handler wrapper (generic version)
 * @param fn - Async function to wrap
 * @returns Wrapped function with error handling
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
