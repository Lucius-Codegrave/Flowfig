import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../validators/auth.validator';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.validator';
import z from 'zod';

/**
 * Middleware to validate registration data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate request body against registration schema
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    // Return validation errors in a structured format
    return res.status(400).json({
      errors: z.treeifyError(result.error),
    });
  }

  // Add validated data to request for use in controller
  req.body = result.data;
  next();
};

/**
 * Middleware to validate login data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Create login schema by picking email and password from registration schema
  const loginSchema = registerSchema.pick({
    email: true,
    password: true,
  });

  // Validate request body against login schema
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    // Return validation errors in a structured format
    return res.status(400).json({
      errors: z.treeifyError(result.error),
    });
  }

  // Add validated data to request for use in controller
  req.body = result.data;
  next();
};

/**
 * Middleware to validate task creation data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate request body against task creation schema
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    // Return validation errors in a structured format
    return res.status(400).json({
      errors: z.treeifyError(result.error),
    });
  }

  // Add validated data to request for use in controller
  req.body = result.data;
  next();
};

/**
 * Middleware to validate task update data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate request body against task update schema
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    // Return validation errors in a structured format
    return res.status(400).json({
      errors: z.treeifyError(result.error),
    });
  }

  // Add validated data to request for use in controller
  req.body = result.data;
  next();
};
