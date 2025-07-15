/**
 * Centralized export for all types in the Flowfig API
 *
 * This barrel file provides a single import point for all types,
 * making it easier to import multiple types in other files.
 *
 * @example
 * import { Role, AuthPayload, CreateTaskRequest } from '../types';
 */

// Authentication and authorization types
export * from './auth.types';
export * from './permissions.types';

// Entity types
export * from './user.types';
export * from './task.types';

// Error handling types
export * from './error.types';

// Re-export Prisma generated types for convenience
export type { User as PrismaUser, Task as PrismaTask } from '@prisma/client';
// Note: PrismaRole will be available after migration and prisma generate
