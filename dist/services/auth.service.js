"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_service_1 = require("./user.service");
const logger_1 = __importDefault(require("../logger"));
/**
 * Authentication service handling user registration and login logic
 */
class AuthService {
    /**
     * Initialize AuthService with UserService dependency
     */
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    /**
     * Register a new user
     * @param email - User email address
     * @param password - User password (plain text)
     * @returns Created user object
     * @throws Error if email already exists
     */
    async registerUser(email, password) {
        // Check if user already exists
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already used');
        }
        // Hash the password
        const hashedPassword = await this.hashPassword(password);
        logger_1.default.info(`Registering new user with email: ${email}`);
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
    async loginUser(email, password) {
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
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    /**
     * Verify a password against its hash
     * @param password - Plain text password
     * @param hash - Hashed password
     * @returns True if password matches hash
     */
    async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    /**
     * Generate JWT token for user
     * @param userId - User ID
     * @returns JWT token
     */
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, env_1.JWT_SECRET, { expiresIn: '1h' });
    }
}
exports.AuthService = AuthService;
// Export singleton instance
exports.authService = new AuthService();
