/**
 * Authentication and authorization types for the Flowfig API
 */

import { Request } from 'express';
import { Role } from '@prisma/client';

// Re-export Prisma Role enum for consistency
export { Role };

/**
 * User login request structure
 */
export interface LoginRequest {
  /** User email address */
  email: string;
  /** User password (plain text) */
  password: string;
}

/**
 * JWT token payload structure
 */
export interface AuthPayload {
  /** User unique identifier */
  userId: number;
  /** User email address */
  email: string;
  /** User role for authorization */
  role: Role;
}

/**
 * JWT token payload structure (as stored in token)
 */
export interface JWTPayload {
  /** User unique identifier */
  userId: number;
  /** Token issued at timestamp */
  iat: number;
  /** Token expiration timestamp */
  exp: number;
}

/**
 * Extended Express Request with authenticated user information
 */
export interface AuthenticatedRequest extends Request {
  /** Authenticated user information (populated by auth middleware) */
  user: {
    id: number;
    email: string;
    role: Role;
  };
}

/**
 * Register request body structure
 */
export interface RegisterRequest {
  /** User email address */
  email: string;
  /** User password (plain text) */
  password: string;
  /** Optional role assignment (admin only) */
  role?: Role;
}

/**
 * Authentication response structure
 */
export interface AuthResponse {
  /** JWT access token */
  token: string;
  /** User information */
  user: {
    id: number;
    email: string;
    role: Role;
  };
}
