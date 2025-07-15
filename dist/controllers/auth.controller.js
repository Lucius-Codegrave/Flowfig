"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * Register a new user
 * @param req - Express request object containing validated user registration data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
exports.register = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Register user through auth service
    const user = await auth_service_1.authService.registerUser(email, password);
    // Return success response with user ID
    res.status(201).json({
        message: 'User created',
        userId: user.id,
    });
});
/**
 * Login user with email and password
 * @param req - Express request object containing validated user login credentials
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with JWT token or error details
 */
exports.login = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    // Authenticate user and get JWT token
    const token = await auth_service_1.authService.loginUser(email, password);
    // Return success response with JWT token
    res.status(200).json({ token });
});
