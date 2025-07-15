"use strict";
/**
 * Role-based access control capabilities and helpers
 *
 * This simplified RBAC system focuses on role capabilities rather than
 * granular permissions, making it easier to evolve toward ACL in the future.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_CAPABILITIES = void 0;
exports.isAdmin = isAdmin;
exports.canAccessAllTasks = canAccessAllTasks;
exports.canCreateTasks = canCreateTasks;
exports.canUpdateAnyTask = canUpdateAnyTask;
exports.canDeleteAnyTask = canDeleteAnyTask;
exports.canManageUsers = canManageUsers;
exports.canViewAllUsers = canViewAllUsers;
exports.canChangeUserRoles = canChangeUserRoles;
exports.ownsResource = ownsResource;
exports.canPerformAction = canPerformAction;
const client_1 = require("@prisma/client");
/**
 * Capabilities for each role in the system
 */
exports.ROLE_CAPABILITIES = {
    [client_1.Role.ADMIN]: {
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
    [client_1.Role.EDITOR]: {
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
    [client_1.Role.VIEWER]: {
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
};
/**
 * Helper functions for role-based authorization
 */
/**
 * Check if a role is admin (has full access)
 */
function isAdmin(role) {
    return role === client_1.Role.ADMIN;
}
/**
 * Check if a role can access all tasks (not just own)
 */
function canAccessAllTasks(role) {
    return exports.ROLE_CAPABILITIES[role].canAccessAllTasks;
}
/**
 * Check if a role can create tasks
 */
function canCreateTasks(role) {
    return exports.ROLE_CAPABILITIES[role].canCreateTasks;
}
/**
 * Check if a role can update any task (not just own)
 */
function canUpdateAnyTask(role) {
    return exports.ROLE_CAPABILITIES[role].canUpdateAnyTask;
}
/**
 * Check if a role can delete any task (not just own)
 */
function canDeleteAnyTask(role) {
    return exports.ROLE_CAPABILITIES[role].canDeleteAnyTask;
}
/**
 * Check if a role can manage users
 */
function canManageUsers(role) {
    return exports.ROLE_CAPABILITIES[role].canManageUsers;
}
/**
 * Check if a role can view all users
 */
function canViewAllUsers(role) {
    return exports.ROLE_CAPABILITIES[role].canViewAllUsers;
}
/**
 * Check if a role can change user roles
 */
function canChangeUserRoles(role) {
    return exports.ROLE_CAPABILITIES[role].canChangeUserRoles;
}
/**
 * Check if a user owns a resource (utility for ownership checks)
 * @param userId - ID of the user
 * @param resourceUserId - ID of the resource owner
 * @returns True if user owns the resource
 */
function ownsResource(userId, resourceUserId) {
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
function canPerformAction(userRole, userId, resourceUserId, action) {
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
