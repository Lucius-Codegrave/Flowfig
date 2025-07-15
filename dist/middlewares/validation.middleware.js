"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateTask = exports.validateCreateTask = exports.validateLogin = exports.validateRegistration = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const task_validator_1 = require("../validators/task.validator");
const zod_1 = __importDefault(require("zod"));
/**
 * Middleware to validate registration data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const validateRegistration = (req, res, next) => {
    // Validate request body against registration schema
    const result = auth_validator_1.registerSchema.safeParse(req.body);
    if (!result.success) {
        // Return validation errors in a structured format
        return res.status(400).json({
            errors: zod_1.default.treeifyError(result.error),
        });
    }
    // Add validated data to request for use in controller
    req.body = result.data;
    next();
};
exports.validateRegistration = validateRegistration;
/**
 * Middleware to validate login data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const validateLogin = (req, res, next) => {
    // Create login schema by picking email and password from registration schema
    const loginSchema = auth_validator_1.registerSchema.pick({
        email: true,
        password: true,
    });
    // Validate request body against login schema
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        // Return validation errors in a structured format
        return res.status(400).json({
            errors: zod_1.default.treeifyError(result.error),
        });
    }
    // Add validated data to request for use in controller
    req.body = result.data;
    next();
};
exports.validateLogin = validateLogin;
/**
 * Middleware to validate task creation data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const validateCreateTask = (req, res, next) => {
    // Validate request body against task creation schema
    const result = task_validator_1.createTaskSchema.safeParse(req.body);
    if (!result.success) {
        // Return validation errors in a structured format
        return res.status(400).json({
            errors: zod_1.default.treeifyError(result.error),
        });
    }
    // Add validated data to request for use in controller
    req.body = result.data;
    next();
};
exports.validateCreateTask = validateCreateTask;
/**
 * Middleware to validate task update data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const validateUpdateTask = (req, res, next) => {
    // Validate request body against task update schema
    const result = task_validator_1.updateTaskSchema.safeParse(req.body);
    if (!result.success) {
        // Return validation errors in a structured format
        return res.status(400).json({
            errors: zod_1.default.treeifyError(result.error),
        });
    }
    // Add validated data to request for use in controller
    req.body = result.data;
    next();
};
exports.validateUpdateTask = validateUpdateTask;
