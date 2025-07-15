"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("./error.middleware");
const types_1 = require("../types");
// Mock the logger
jest.mock('../logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
}));
// Import the mocked logger to access it in tests
const logger_1 = __importDefault(require("../logger"));
const mockLogger = logger_1.default;
describe('ErrorMiddleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });
    describe('AppError', () => {
        it('should create custom error with correct properties', () => {
            // Given
            const message = 'Custom error message';
            const statusCode = 400;
            // When
            const error = new types_1.AppError(message, statusCode);
            // Then
            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(statusCode);
            expect(error.isOperational).toBe(true);
            expect(error instanceof Error).toBe(true);
        });
    });
    describe('errorHandler', () => {
        it('should handle AppError with custom status code', () => {
            // Given
            const error = new types_1.AppError('Custom error', 400);
            // When
            (0, error_middleware_1.errorHandler)(error, mockReq, mockRes, mockNext);
            // Then
            expect(mockLogger.error).toHaveBeenCalledWith('Error:', error);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Custom error',
            });
        });
        it('should handle "Email already used" error with 409 status', () => {
            // Given
            const error = new Error('Email already used');
            // When
            (0, error_middleware_1.errorHandler)(error, mockReq, mockRes, mockNext);
            // Then
            expect(mockLogger.error).toHaveBeenCalledWith('Error:', error);
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email already used',
            });
        });
        it('should handle "Invalid email or password" error with 401 status', () => {
            // Given
            const error = new Error('Invalid email or password');
            // When
            (0, error_middleware_1.errorHandler)(error, mockReq, mockRes, mockNext);
            // Then
            expect(mockLogger.error).toHaveBeenCalledWith('Error:', error);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
        });
        it('should handle generic errors with 500 status', () => {
            // Given
            const error = new Error('Generic error');
            // When
            (0, error_middleware_1.errorHandler)(error, mockReq, mockRes, mockNext);
            // Then
            expect(mockLogger.error).toHaveBeenCalledWith('Error:', error);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        });
    });
    describe('asyncHandler', () => {
        it('should call next when async function succeeds', async () => {
            // Given
            const mockAsyncFn = jest.fn().mockResolvedValue('success');
            const wrappedFn = (0, error_middleware_1.asyncHandler)(mockAsyncFn);
            // When
            await wrappedFn(mockReq, mockRes, mockNext);
            // Then
            expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should call next with error when async function rejects', async () => {
            // Given
            const error = new Error('Async error');
            const mockAsyncFn = jest.fn().mockRejectedValue(error);
            const wrappedFn = (0, error_middleware_1.asyncHandler)(mockAsyncFn);
            // When
            await wrappedFn(mockReq, mockRes, mockNext);
            // Then
            expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledWith(error);
        });
        it('should call next with error when async function throws', async () => {
            // Given
            const error = new Error('Sync error in async function');
            const mockAsyncFn = jest.fn().mockImplementation(async () => {
                throw error;
            });
            const wrappedFn = (0, error_middleware_1.asyncHandler)(mockAsyncFn);
            // When
            await wrappedFn(mockReq, mockRes, mockNext);
            // Then
            expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
