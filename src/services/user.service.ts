import prisma from '../config/db';
import logger from '../logger';
import { CreateUserRequest } from '../types';

/**
 * User service handling user-related database operations
 */
export class UserService {
  /**
   * Find a user by email address
   * @param email - User email address
   * @returns User object or null if not found
   */
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user in the database
   * @param userData - User data to create
   * @returns Created user object
   */
  async createUser(userData: CreateUserRequest) {
    logger.info(`Creating user with email: ${userData.email}`);

    return prisma.user.create({
      data: userData,
    });
  }

  /**
   * Check if a user exists by email
   * @param email - User email address
   * @returns True if user exists, false otherwise
   */
  async userExists(email: string) {
    const user = await this.findUserByEmail(email);
    return user !== null;
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User object or null if not found
   */
  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

// Export singleton instance for dependency injection
export const userService = new UserService();
