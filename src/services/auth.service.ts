import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { UserService } from './user.service';

/**
 * Authentication service handling user registration and login logic
 */
export class AuthService {
  private userService: UserService;

  /**
   * Initialize AuthService with UserService dependency
   */
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   * @param email - User email address
   * @param password - User password (plain text)
   * @returns Created user object
   * @throws Error if email already exists
   */
  async registerUser(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already used');
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(password);

    // Create new user
    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * Authenticate user and return JWT token
   * @param email - User email address
   * @param password - User password (plain text)
   * @returns JWT token
   * @throws Error if credentials are invalid
   */
  async loginUser(email: string, password: string): Promise<string> {
    // Find user by email
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate and return JWT token
    return this.generateToken(user.id);
  }

  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify a password against its hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if password matches hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token for user
   * @param userId - User ID
   * @returns JWT token
   */
  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  }
}

// Export singleton instance
export const authService = new AuthService();
