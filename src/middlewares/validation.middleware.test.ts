import { Request, Response, NextFunction } from 'express';
import { validateRegistration, validateLogin } from './validation.middleware';

// Mock zod
jest.mock('zod', () => ({
  ...jest.requireActual('zod'),
  treeifyError: jest.fn(),
}));

// Mock auth validator
jest.mock('../validators/auth.validator', () => ({
  registerSchema: {
    safeParse: jest.fn(),
    pick: jest.fn(),
  },
}));

// Import mocked modules
import z from 'zod';
import { registerSchema } from '../validators/auth.validator';

describe('ValidationMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockRegisterSchema: any;
  let mockZod: any;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    mockRegisterSchema = registerSchema;
    mockZod = z;
    jest.clearAllMocks();
  });

  describe('validateRegistration', () => {
    it('should call next when validation succeeds', () => {
      // Given
      const requestBody = {
        email: 'user@example.com',
        password: 'Test123!@#',
      };
      const validatedData = {
        email: 'user@example.com',
        password: 'Test123!@#',
      };
      mockReq.body = requestBody;
      mockRegisterSchema.safeParse.mockReturnValue({
        success: true,
        data: validatedData,
      });

      // When
      validateRegistration(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockRegisterSchema.safeParse).toHaveBeenCalledWith(requestBody);
      expect(mockReq.body).toEqual(validatedData);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 when validation fails', () => {
      // Given
      const requestBody = {
        email: 'invalid-email',
        password: '123',
      };
      const validationError = {
        issues: [{ path: ['email'], message: 'Invalid email' }],
      };
      const treeifiedError = {
        email: ['Invalid email'],
      };
      mockReq.body = requestBody;
      mockRegisterSchema.safeParse.mockReturnValue({
        success: false,
        error: validationError,
      });
      mockZod.treeifyError.mockReturnValue(treeifiedError);

      // When
      validateRegistration(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockRegisterSchema.safeParse).toHaveBeenCalledWith(requestBody);
      expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: treeifiedError,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('validateLogin', () => {
    it('should call next when validation succeeds', () => {
      // Given
      const requestBody = {
        email: 'user@example.com',
        password: 'Test123!@#',
      };
      const validatedData = {
        email: 'user@example.com',
        password: 'Test123!@#',
      };
      const loginSchema = {
        safeParse: jest.fn().mockReturnValue({
          success: true,
          data: validatedData,
        }),
      };
      mockReq.body = requestBody;
      mockRegisterSchema.pick.mockReturnValue(loginSchema);

      // When
      validateLogin(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
        email: true,
        password: true,
      });
      expect(loginSchema.safeParse).toHaveBeenCalledWith(requestBody);
      expect(mockReq.body).toEqual(validatedData);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 when validation fails', () => {
      // Given
      const requestBody = {
        email: 'invalid-email',
        password: '123',
      };
      const validationError = {
        issues: [{ path: ['password'], message: 'Password too short' }],
      };
      const treeifiedError = {
        password: ['Password too short'],
      };
      const loginSchema = {
        safeParse: jest.fn().mockReturnValue({
          success: false,
          error: validationError,
        }),
      };
      mockReq.body = requestBody;
      mockRegisterSchema.pick.mockReturnValue(loginSchema);
      mockZod.treeifyError.mockReturnValue(treeifiedError);

      // When
      validateLogin(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
        email: true,
        password: true,
      });
      expect(loginSchema.safeParse).toHaveBeenCalledWith(requestBody);
      expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: treeifiedError,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing request body', () => {
      // Given
      const validationError = {
        issues: [{ path: ['email'], message: 'Required' }],
      };
      const treeifiedError = {
        email: ['Required'],
      };
      const loginSchema = {
        safeParse: jest.fn().mockReturnValue({
          success: false,
          error: validationError,
        }),
      };
      mockReq.body = undefined;
      mockRegisterSchema.pick.mockReturnValue(loginSchema);
      mockZod.treeifyError.mockReturnValue(treeifiedError);

      // When
      validateLogin(mockReq as Request, mockRes as Response, mockNext);

      // Then
      expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
        email: true,
        password: true,
      });
      expect(loginSchema.safeParse).toHaveBeenCalledWith(undefined);
      expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        errors: treeifiedError,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
