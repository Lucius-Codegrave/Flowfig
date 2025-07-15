/**
 * Role-based access control capabilities and helpers
 *
 * This simplified RBAC system focuses on role capabilities rather than
 * granular permissions, making it easier to evolve toward ACL in the future.
 */

import { Role } from '@prisma/client';

/**
 * Capabilities for each role in the system
 */
export const ROLE_CAPABILITIES = {
  [Role.ADMIN]: {
    // Task management
    canAccessAllTasks: true,
    canCreateTasks: true,
    canUpdateAnyTask: true,
    canDeleteAnyTask: true,

    // User management
    canManageUsers: true,
    canViewAllUsers: true,
    canChangeUserRoles: true,
    canDeleteUsers: true,

    // System management
    canAccessAdminPanel: true,
  },

  [Role.EDITOR]: {
    // Task management (own only)
    canAccessAllTasks: false,
    canCreateTasks: true,
    canUpdateAnyTask: false,
    canDeleteAnyTask: false,

    // User management (limited)
    canManageUsers: false,
    canViewAllUsers: false,
    canChangeUserRoles: false,
    canDeleteUsers: false,

    // System management
    canAccessAdminPanel: false,
  },

  [Role.VIEWER]: {
    // Task management (read-only own)
    canAccessAllTasks: false,
    canCreateTasks: false,
    canUpdateAnyTask: false,
    canDeleteAnyTask: false,

    // User management (none)
    canManageUsers: false,
    canViewAllUsers: false,
    canChangeUserRoles: false,
    canDeleteUsers: false,

    // System management
    canAccessAdminPanel: false,
  },
} as const;

/**
 * Helper functions for role-based authorization
 */

/**
 * Check if a role is admin (has full access)
 */
export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

/**
 * Check if a role can access all tasks (not just own)
 */
export function canAccessAllTasks(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canAccessAllTasks;
}

/**
 * Check if a role can create tasks
 */
export function canCreateTasks(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canCreateTasks;
}

/**
 * Check if a role can update any task (not just own)
 */
export function canUpdateAnyTask(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canUpdateAnyTask;
}

/**
 * Check if a role can delete any task (not just own)
 */
export function canDeleteAnyTask(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canDeleteAnyTask;
}

/**
 * Check if a role can manage users
 */
export function canManageUsers(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canManageUsers;
}

/**
 * Check if a role can view all users
 */
export function canViewAllUsers(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canViewAllUsers;
}

/**
 * Check if a role can change user roles
 */
export function canChangeUserRoles(role: Role): boolean {
  return ROLE_CAPABILITIES[role].canChangeUserRoles;
}

/**
 * Check if a user owns a resource (utility for ownership checks)
 * @param userId - ID of the user
 * @param resourceUserId - ID of the resource owner
 * @returns True if user owns the resource
 */
export function ownsResource(userId: number, resourceUserId: number): boolean {
  return userId === resourceUserId;
}

/**
 * Check if a user can perform an action on a resource
 * @param userRole - Role of the user
 * @param userId - ID of the user
 * @param resourceUserId - ID of the resource owner
 * @param action - Action to perform ('read', 'update', 'delete')
 * @returns True if action is allowed
 */
export function canPerformAction(
  userRole: Role,
  userId: number,
  resourceUserId: number,
  action: 'read' | 'update' | 'delete'
): boolean {
  // Admin can do everything
  if (isAdmin(userRole)) {
    return true;
  }

  // Users can only act on their own resources
  const isOwner = ownsResource(userId, resourceUserId);

  switch (action) {
    case 'read':
      return isOwner; // All roles can read their own
    case 'update':
      return isOwner && canCreateTasks(userRole); // EDITOR+ can update own
    case 'delete':
      return isOwner && canCreateTasks(userRole); // EDITOR+ can delete own
    default:
      return false;
  }
}
