import { Request, Response, NextFunction } from 'express';
import { errorHandler, asyncHandler, AppError } from './error.middleware';

describe('ErrorMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('AppError', () => {
    it('should create custom error with correct properties', () => {
      // Given
      const message = 'Custom error message';
      const statusCode = 400;

      // When
      const error = new AppError(message, statusCode);

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
      const error = new AppError('Custom error', 400);

      // When
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Custom error',
      });
    });

    it('should handle "Email already used" error with 409 status', () => {
      // Given
      const error = new Error('Email already used');

      // When
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email already used',
      });
    });

    it('should handle "Invalid email or password" error with 401 status', () => {
      // Given
      const error = new Error('Invalid email or password');

      // When
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    it('should handle generic errors with 500 status', () => {
      // Given
      const error = new Error('Generic error');

      // When
      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
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
      const wrappedFn = asyncHandler(mockAsyncFn);

      // When
      await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when async function rejects', async () => {
      // Given
      const error = new Error('Async error');
      const mockAsyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(mockAsyncFn);

      // When
      await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

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
      const wrappedFn = asyncHandler(mockAsyncFn);

      // When
      await wrappedFn(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockAsyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
