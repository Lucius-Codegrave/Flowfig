"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionService = exports.PermissionService = void 0;
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../config/db"));
const logger_1 = __importDefault(require("../logger"));
/**
 * Permission service handling task permission-related database operations
 */
class PermissionService {
    /**
     * Get all permissions that include the requested permission (hierarchy)
     * @param permission - The requested permission
     * @returns Array of permissions that grant access to the requested permission
     */
    getPermissionHierarchy(permission) {
        switch (permission) {
            case client_1.Permission.READ:
                // READ is granted by: READ or WRITE (WRITE includes READ)
                return [client_1.Permission.READ, client_1.Permission.WRITE];
            case client_1.Permission.WRITE:
                // WRITE is only granted by: WRITE
                return [client_1.Permission.WRITE];
            default:
                return [permission];
        }
    }
    /**
     * Checks if a user has a specific permission for a task.
     * @param taskId - The ID of the task.
     * @param userId - The ID of the user.
     * @param permission - The type of permission to check.
     * @returns True if the user has the permission, false otherwise.
     */
    async hasPermission(taskId, userId, permission) {
        // Check if the user is the owner of the task (using only ownerId for performance)
        const task = await db_1.default.task.findUnique({
            where: { id: taskId },
            select: { ownerId: true }, // ✅ Plus rapide que de joindre owner
        });
        // If the user is the owner, they have all permissions
        if (task?.ownerId === userId) {
            return true;
        }
        // Get all permissions that would grant the requested permission
        const allowedPermissions = this.getPermissionHierarchy(permission);
        // Check if the user has any of the allowed permissions for the task
        const taskPermission = await db_1.default.taskPermission.findFirst({
            where: {
                taskId,
                userId,
                permission: { in: allowedPermissions },
            },
        });
        return !!taskPermission;
    }
    /**
     * Grants a permission to a user for a specific task.
     * @param taskId - The ID of the task.
     * @param userId - The ID of the user to whom the permission is granted.
     * @param permission - The type of permission to grant.
     * @param grantedBy - The ID of the user granting the permission.
     * @returns A promise that resolves when the permission is granted.
     */
    async grantPermission(taskId, userId, permission, grantedBy) {
        logger_1.default.info(`Granting permission ${permission} for task ${taskId} to user ${userId} by user ${grantedBy}`);
        // Implementation logic to grant permission
        await db_1.default.taskPermission.create({
            data: {
                taskId,
                userId,
                permission,
                grantedBy,
            },
        });
    }
    /**
     * Revokes a permission from a user for a specific task.
     * @param taskId - The ID of the task.
     * @param userId - The ID of the user from whom the permission is revoked.
     * @returns A promise that resolves when the permission is revoked.
     */
    async revokePermission(taskId, userId) {
        logger_1.default.info(`Revoking permission for task ${taskId} from user ${userId}`);
        // Delete the permission record for the specified task and user
        await db_1.default.taskPermission.deleteMany({
            where: {
                taskId,
                userId,
            },
        });
    }
    /**
     * Updates a permission for a user for a specific task.
     * @param taskId - The ID of the task.
     * @param userId - The ID of the user whose permission is updated.
     * @param permission - The new permission type.
     * @param grantedBy - The ID of the user updating the permission.
     * @returns A promise that resolves when the permission is updated.
     */
    async updatePermission(taskId, userId, permission, grantedBy) {
        logger_1.default.info(`Updating permission for task ${taskId} user ${userId} to ${permission} by user ${grantedBy}`);
        // Check if permission exists
        const existingPermission = await this.getPermission(taskId, userId);
        if (existingPermission) {
            // Update existing permission
            await db_1.default.taskPermission.update({
                where: {
                    id: existingPermission.id,
                },
                data: {
                    permission,
                    grantedBy,
                    grantedAt: new Date(),
                },
            });
        }
        else {
            // Create new permission
            await this.grantPermission(taskId, userId, permission, grantedBy);
        }
    }
    /**
     * Get permission for a task
     * @param taskId - ID of the task
     * @param userId - ID of the user
     * @returns TaskPermission object or null if not found
     */
    async getPermission(taskId, userId) {
        return db_1.default.taskPermission.findFirst({
            where: {
                taskId,
                userId,
            },
        });
    }
}
exports.PermissionService = PermissionService;
// Export singleton instance for dependency injection
exports.permissionService = new PermissionService();
