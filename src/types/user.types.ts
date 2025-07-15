/**
 * User-related types and interfaces
 */

import { Role } from '@prisma/client';

/**
 * User entity structure (from database)
 */
export interface User {
  /** User unique identifier */
  id: number;
  /** User email address */
  email: string;
  /** Hashed password */
  password: string;
  /** User role */
  role: Role;
}

/**
 * User data for API responses (without sensitive information)
 */
export interface UserResponse {
  /** User unique identifier */
  id: number;
  /** User email address */
  email: string;
  /** User role */
  role: Role;
}

/**
 * User creation request structure
 */
export interface CreateUserRequest {
  /** User email address */
  email: string;
  /** User password (plain text) */
  password: string;
  /** User role (optional, defaults to EDITOR) */
  role?: Role;
}

/**
 * User update request structure
 */
export interface UpdateUserRequest {
  /** Updated email address */
  email?: string;
  /** Updated password (plain text) */
  password?: string;
  /** Updated role (admin only) */
  role?: Role;
}

/**
 * User list query parameters
 */
export interface UserListQuery {
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Filter by role */
  role?: Role;
  /** Search by email */
  search?: string;
}

/**
 * User with owned tasks (from TaskOwner relation)
 */
export interface UserWithOwnedTasks extends UserResponse {
  /** Tasks owned by this user */
  ownedTasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
  }>;
}

/**
 * User with task permissions received
 */
export interface UserWithTaskPermissions extends UserResponse {
  /** Permissions this user has on various tasks */
  taskPermissions: Array<{
    id: number;
    taskId: number;
    permission: string;
    grantedAt: Date;
    task: {
      id: number;
      title: string;
    };
  }>;
}

/**
 * User with permissions statistics
 */
export interface UserWithPermissionStats extends UserResponse {
  /** Number of tasks owned by this user */
  ownedTasksCount: number;
  /** Number of permissions granted to this user */
  receivedPermissionsCount: number;
  /** Number of permissions granted by this user */
  grantedPermissionsCount: number;
}

/**
 * User profile with full ACL context
 */
export interface UserProfile extends UserResponse {
  /** Tasks owned by this user */
  ownedTasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
  }>;
  /** Tasks this user has permissions on */
  accessibleTasks: Array<{
    id: number;
    title: string;
    permission: string;
    grantedAt: Date;
  }>;
  /** Statistics */
  stats: {
    ownedTasksCount: number;
    receivedPermissionsCount: number;
    grantedPermissionsCount: number;
  };
}
