"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_service_1 = require("../services/user.service");
/**
 * Middleware to authenticate JWT token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const authenticateToken = async (req, res, next) => {
    // Extract token from Authorization header (format: "Bearer TOKEN")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Check if token is provided
    if (!token) {
        return res.status(401).json({
            message: 'Access token required',
        });
    }
    try {
        // Verify and decode JWT token using secret
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        // Find user by ID extracted from token payload
        const user = await user_service_1.userService.findUserById(decoded.userId);
        // Check if user still exists in database
        if (!user) {
            return res.status(401).json({
                message: 'Invalid token - user not found',
            });
        }
        // Attach user information to request object for use in controllers
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        // Continue to next middleware or controller
        next();
    }
    catch {
        // Handle invalid, expired, or malformed tokens
        return res.status(403).json({
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticateToken = authenticateToken;
