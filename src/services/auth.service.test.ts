import { AuthService } from './auth.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// Mock the UserService
jest.mock('./user.service', () => ({
  UserService: jest.fn().mockImplementation(() => ({
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  })),
}));

// Import mocked modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: any;
  let mockBcrypt: any;
  let mockJwt: any;

  beforeEach(() => {
    authService = new AuthService();
    mockUserService = (authService as any).userService;
    mockBcrypt = bcrypt;
    mockJwt = jwt;
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      // Given
      const email = 'newuser@example.com';
      const password = 'Test123!@#';
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: 1,
        email,
        password: hashedPassword,
      };

      mockUserService.findUserByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserService.createUser.mockResolvedValue(createdUser);

      // When
      const result = await authService.registerUser(email, password);

      // Then
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email,
        password: hashedPassword,
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw error when email already exists', async () => {
      // Given
      const email = 'existing@example.com';
      const password = 'Test123!@#';
      const existingUser = {
        id: 1,
        email,
        password: 'someHashedPassword',
      };

      mockUserService.findUserByEmail.mockResolvedValue(existingUser);

      // When & Then
      await expect(authService.registerUser(email, password)).rejects.toThrow(
        'Email already used'
      );
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'Test123!@#';
      const hashedPassword = 'hashedPassword123';
      const userId = 1;
      const token = 'jwt-token-abc123';
      const user = {
        id: userId,
        email,
        password: hashedPassword,
      };

      mockUserService.findUserByEmail.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue(token);

      // When
      const result = await authService.loginUser(email, password);

      // Then
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId },
        expect.any(String),
        { expiresIn: '1h' }
      );
      expect(result).toBe(token);
    });

    it('should throw error when user does not exist', async () => {
      // Given
      const email = 'nonexistent@example.com';
      const password = 'Test123!@#';

      mockUserService.findUserByEmail.mockResolvedValue(null);

      // When & Then
      await expect(authService.loginUser(email, password)).rejects.toThrow(
        'Invalid email or password'
      );
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      // Given
      const email = 'user@example.com';
      const password = 'wrongPassword';
      const hashedPassword = 'hashedPassword123';
      const user = {
        id: 1,
        email,
        password: hashedPassword,
      };

      mockUserService.findUserByEmail.mockResolvedValue(user);
      mockBcrypt.compare.mockResolvedValue(false);

      // When & Then
      await expect(authService.loginUser(email, password)).rejects.toThrow(
        'Invalid email or password'
      );
      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      // Given
      const password = 'Test123!@#';
      const hashedPassword = 'hashedPassword123';

      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      // When
      const result = await authService.hashPassword(password);

      // Then
      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for valid password', async () => {
      // Given
      const password = 'Test123!@#';
      const hash = 'hashedPassword123';

      mockBcrypt.compare.mockResolvedValue(true);

      // When
      const result = await authService.verifyPassword(password, hash);

      // Then
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      // Given
      const password = 'wrongPassword';
      const hash = 'hashedPassword123';

      mockBcrypt.compare.mockResolvedValue(false);

      // When
      const result = await authService.verifyPassword(password, hash);

      // Then
      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token correctly', () => {
      // Given
      const userId = 1;
      const token = 'jwt-token-abc123';

      mockJwt.sign.mockReturnValue(token);

      // When
      const result = authService.generateToken(userId);

      // Then
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId },
        expect.any(String),
        { expiresIn: '1h' }
      );
      expect(result).toBe(token);
    });
  });
});
