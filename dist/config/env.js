"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_ORIGINS = exports.DB_URL = exports.PORT = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
/**
 * JWT secret key for token signing and verification
 * Must be set in environment variables for security
 */
exports.JWT_SECRET = process.env.JWT_SECRET;
/**
 * Server port configuration
 * Defaults to 3000 if not specified in environment
 */
exports.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
/**
 * Database connection URL for Prisma
 * Must be set in environment variables
 */
exports.DB_URL = process.env.DATABASE_URL;
/**
 * CORS allowed origins for frontend applications
 * Can be configured via environment variable as comma-separated string
 * Defaults to common development ports
 */
exports.CORS_ORIGINS = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];
