import { z } from 'zod';

/**
 * Validation schema for user registration
 * Enforces secure password requirements and email format
 */
export const registerSchema = z.object({
  // Email must be valid format
  email: z.email(),

  // Password with comprehensive security requirements
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be less than 64 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    )
    .regex(/^\S*$/, 'Password must not contain spaces'),
});
