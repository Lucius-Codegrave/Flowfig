import { z } from 'zod';

/**
 * Validation schema for creating a task
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
});

/**
 * Validation schema for updating a task
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty')
    .max(100, 'Title must not exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
  completed: z.boolean().optional(),
});

/**
 * Validation schema for task ID parameter
 */
export const taskIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Task ID must be a valid number'),
});
