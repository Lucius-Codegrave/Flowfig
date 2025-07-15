import { Request, Response } from 'express';
import { register, login } from './auth.controller';

// Mock the auth service module
jest.mock('../services/auth.service', () => ({
  authService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  },
}));

// Import the mocked service
import { authService } from '../services/auth.service';
import { Role } from '@prisma/client';
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonResponse: jest.Mock;
  let mockStatus: jest.Mock;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Initialize response mocks
    mockJsonResponse = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJsonResponse });
    mockNext = jest.fn();

    // Initialize request and response objects
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJsonResponse,
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    it('should successfully create a user with valid data', async () => {
      // Given
      mockRequest.body = validUserData;
      const createdUser = {
        id: 1,
        email: validUserData.email,
        password: 'hashedPassword123',
        role: Role.EDITOR,
      };
      mockAuthService.registerUser.mockResolvedValue(createdUser);

      // When
      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Then
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(
        validUserData.email,
        validUserData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'User created',
        userId: 1,
      });
    });

    it('should handle service errors when email already exists', async () => {
      // Given
      mockRequest.body = validUserData;
      const error = new Error('Email already used');
      mockAuthService.registerUser.mockRejectedValue(error);

      // When
      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Then
      await new Promise(resolve => setImmediate(resolve)); // Allow any pending promises to resolve
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockStatus).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    it('should successfully authenticate user with valid credentials', async () => {
      // Given
      mockRequest.body = validLoginData;
      const token = 'jwt-token-abc123';
      mockAuthService.loginUser.mockResolvedValue(token);

      // When
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      // Then
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(
        validLoginData.email,
        validLoginData.password
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith({ token });
    });

    it('should handle invalid credentials', async () => {
      // Given
      mockRequest.body = validLoginData;
      const error = new Error('Invalid email or password');
      mockAuthService.loginUser.mockRejectedValue(error);

      // When
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      // Then
      await new Promise(resolve => setImmediate(resolve)); // Allow any pending promises to resolve
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockStatus).not.toHaveBeenCalled();
    });
  });
});
