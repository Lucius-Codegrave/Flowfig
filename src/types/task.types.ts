/**
 * Task-related types and interfaces
 */

import { Permission } from '@prisma/client';

/**
 * Route parameter interface for task ID
 */
export interface TaskParams {
  /** Task ID from URL parameter */
  id: string;
}

/**
 * Task entity structure (from database)
 */
export interface Task {
  /** Task unique identifier */
  id: number;
  /** Task title */
  title: string;
  /** Task description (optional) */
  description?: string;
  /** Task completion status */
  completed: boolean;
  /** Task creation timestamp */
  createdAt: Date;
  /** Owner user ID */
  ownerId: number;
}

/**
 * Task creation request structure
 */
export interface CreateTaskRequest {
  /** Task title */
  title: string;
  /** Task description (optional) */
  description?: string;
}

/**
 * Task update request structure
 */
export interface UpdateTaskRequest {
  /** Updated task title */
  title?: string;
  /** Updated task description */
  description?: string;
  /** Updated completion status */
  completed?: boolean;
}

/**
 * Task list query parameters
 */
export interface TaskListQuery {
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Filter by completion status */
  completed?: boolean;
  /** Search in title/description */
  search?: string;
  /** Filter by user ID (admin only) */
  userId?: number;
}

/**
 * Task response with owner information
 */
export interface TaskWithOwner extends Task {
  /** Task owner information */
  owner: {
    id: number;
    email: string;
  };
}

/**
 * User's permissions and access context for a specific task
 */
export interface UserTaskContext {
  /** Task ID this context applies to */
  taskId: number;
  /** Permissions the user has on this task */
  permissions: Permission[];
  /** Whether user is the owner */
  isOwner: boolean;
  /** When permissions were granted */
  grantedAt?: Date;
}

/**
 * Task permission entity
 */
export interface TaskPermission {
  /** Permission unique identifier */
  id: number;
  /** Task ID */
  taskId: number;
  /** User ID who has the permission */
  userId: number;
  /** Type of permission */
  permission: Permission;
  /** User who granted this permission */
  grantedById: number;
  /** Permission grant timestamp */
  grantedAt: Date;
}

/**
 * Task permission with related entities
 */
export interface TaskPermissionWithDetails extends TaskPermission {
  /** Task information */
  task: {
    id: number;
    title: string;
  };
  /** User who has the permission */
  user: {
    id: number;
    email: string;
  };
  /** User who granted the permission */
  grantedBy: {
    id: number;
    email: string;
  };
}

/**
 * Permission grant request
 */
export interface GrantPermissionRequest {
  /** User ID to grant permission to */
  userId: number;
  /** Type of permission to grant */
  permission: Permission;
}

/**
 * Permission revoke request
 */
export interface RevokePermissionRequest {
  /** User ID to revoke permission from */
  userId: number;
  /** Type of permission to revoke */
  permission: Permission;
}

/**
 * Task permissions summary
 */
export interface TaskPermissionsSummary {
  /** Task ID */
  taskId: number;
  /** Owner information */
  owner: {
    id: number;
    email: string;
  };
  /** Users with READ permission */
  readers: Array<{
    id: number;
    email: string;
    grantedAt: Date;
  }>;
  /** Users with WRITE permission */
  writers: Array<{
    id: number;
    email: string;
    grantedAt: Date;
  }>;
  /** Users with DELETE permission */
  deleters: Array<{
    id: number;
    email: string;
    grantedAt: Date;
  }>;
  /** Users with SHARE permission */
  sharers: Array<{
    id: number;
    email: string;
    grantedAt: Date;
  }>;
}
