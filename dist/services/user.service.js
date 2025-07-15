"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const db_1 = __importDefault(require("../config/db"));
const logger_1 = __importDefault(require("../logger"));
/**
 * User service handling user-related database operations
 */
class UserService {
    /**
     * Find a user by email address
     * @param email - User email address
     * @returns User object or null if not found
     */
    async findUserByEmail(email) {
        return db_1.default.user.findUnique({
            where: { email },
        });
    }
    /**
     * Create a new user in the database
     * @param userData - User data to create
     * @returns Created user object
     */
    async createUser(userData) {
        logger_1.default.info(`Creating user with email: ${userData.email}`);
        return db_1.default.user.create({
            data: userData,
        });
    }
    /**
     * Check if a user exists by email
     * @param email - User email address
     * @returns True if user exists, false otherwise
     */
    async userExists(email) {
        const user = await this.findUserByEmail(email);
        return user !== null;
    }
    /**
     * Find a user by ID
     * @param id - User ID
     * @returns User object or null if not found
     */
    async findUserById(id) {
        return db_1.default.user.findUnique({
            where: { id },
        });
    }
}
exports.UserService = UserService;
// Export singleton instance for dependency injection
exports.userService = new UserService();
