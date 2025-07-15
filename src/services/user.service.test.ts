import { UserService } from './user.service';

// Mock the db module
jest.mock('../config/db', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Import mocked module
import prisma from '../config/db';
import { CreateUserRequest } from '../types';

describe('UserService', () => {
  let userService: UserService;
  let mockFindUnique: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    userService = new UserService();
    mockFindUnique = prisma.user.findUnique as jest.Mock;
    mockCreate = prisma.user.create as jest.Mock;
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return user when found by email', async () => {
      // Given
      const testEmail = 'test@example.com';
      const expectedUser = {
        id: 1,
        email: testEmail,
        password: 'hashedPassword123',
      };
      mockFindUnique.mockResolvedValue(expectedUser);

      // When
      const result = await userService.findUserByEmail(testEmail);

      // Then
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: testEmail },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      // Given
      const testEmail = 'notfound@example.com';
      mockFindUnique.mockResolvedValue(null);

      // When
      const result = await userService.findUserByEmail(testEmail);

      // Then
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should successfully create a new user', async () => {
      // Given
      const userData: CreateUserRequest = {
        email: 'newuser@example.com',
        password: 'hashedPassword123',
      };
      const expectedCreatedUser = {
        id: 1,
        ...userData,
      };
      mockCreate.mockResolvedValue(expectedCreatedUser);

      // When
      const result = await userService.createUser(userData);

      // Then
      expect(mockCreate).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(expectedCreatedUser);
    });

    it('should handle database errors during user creation', async () => {
      // Given
      const userData: CreateUserRequest = {
        email: 'existing@example.com',
        password: 'hashedPassword123',
      };
      const dbError = new Error('Email already exists');
      mockCreate.mockRejectedValue(dbError);

      // When & Then
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Email already exists'
      );
    });
  });

  describe('userExists', () => {
    it('should return true when user exists', async () => {
      // Given
      const testEmail = 'exists@example.com';
      const existingUser = { id: 1, email: testEmail, password: 'hash' };
      mockFindUnique.mockResolvedValue(existingUser);

      // When
      const result = await userService.userExists(testEmail);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      // Given
      const testEmail = 'notexists@example.com';
      mockFindUnique.mockResolvedValue(null);

      // When
      const result = await userService.userExists(testEmail);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('findUserById', () => {
    it('should return user when found by ID', async () => {
      // Given
      const testUserId = 1;
      const expectedUser = {
        id: testUserId,
        email: 'test@example.com',
        password: 'hashedPassword123',
      };
      mockFindUnique.mockResolvedValue(expectedUser);

      // When
      const result = await userService.findUserById(testUserId);

      // Then
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: testUserId },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found by ID', async () => {
      // Given
      const testUserId = 999;
      mockFindUnique.mockResolvedValue(null);

      // When
      const result = await userService.findUserById(testUserId);

      // Then
      expect(result).toBeNull();
    });
  });
});
