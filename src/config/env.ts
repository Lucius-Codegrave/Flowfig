import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * JWT secret key for token signing and verification
 * Must be set in environment variables for security
 */
export const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Server port configuration
 * Defaults to 3000 if not specified in environment
 */
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

/**
 * Database connection URL for Prisma
 * Must be set in environment variables
 */
export const DB_URL = process.env.DATABASE_URL as string;

/**
 * CORS allowed origins for frontend applications
 * Can be configured via environment variable as comma-separated string
 * Defaults to common development ports
 */
export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];
