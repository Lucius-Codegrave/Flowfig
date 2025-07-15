"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../config/db"));
const logger_1 = __importDefault(require("../logger"));
/**
 * Task service handling task-related database operations
 */
class TaskService {
    /**
     * Create a new task for a user
     * @param taskData - Task data to create
     * @returns Created task object
     */
    async createTask(taskData) {
        logger_1.default.info(`Creating task: ${taskData.title} for owner ID: ${taskData.ownerId}`);
        return db_1.default.task.create({
            data: taskData,
        });
    }
    /**
     * Get all tasks accessible by a user
     * @param userId - User ID to filter tasks
     * @returns List of tasks accessible by the user
     */
    async getAccessibleTasks(userId) {
        // Fetch tasks where user is either the owner or has permissions
        return db_1.default.task.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    {
                        permissions: {
                            some: {
                                userId: userId,
                                permission: { in: [client_1.Permission.READ, client_1.Permission.WRITE] },
                            },
                        },
                    },
                ],
            },
            include: {
                owner: { select: { id: true, email: true } },
                permissions: true,
            },
        });
    }
    /**
     * Get a specific task by ID
     */
    async getTaskById(taskId) {
        return db_1.default.task.findUnique({
            where: { id: taskId },
            include: {
                owner: { select: { id: true, email: true } },
            },
        });
    }
    /**
     * Update a task
     * @param taskId - Task ID
     * @param userId - User ID (for security - must be owner)
     * @param updateData - Data to update
     * @returns Updated task object or null if not found/unauthorized
     */
    async updateTask(taskId, userId, updateData) {
        logger_1.default.info(`Updating task ID: ${taskId} for owner ID: ${userId}`);
        // First check if task exists and belongs to user
        const task = await db_1.default.task.findFirst({
            where: {
                id: taskId,
                ownerId: userId,
            },
        });
        if (!task) {
            return null; // Task not found or user not authorized
        }
        // Update the task (we know it exists and belongs to user)
        return db_1.default.task.update({
            where: { id: taskId },
            data: updateData,
        });
    }
    /**
     * Delete a task
     * @param taskId - Task ID
     * @param userId - User ID (for security - must be owner)
     * @returns Deleted task object or null if not found/unauthorized
     */
    async deleteTask(taskId, userId) {
        logger_1.default.info(`Deleting task ID: ${taskId} for owner ID: ${userId}`);
        // First check if task exists and belongs to user
        const task = await db_1.default.task.findFirst({
            where: {
                id: taskId,
                ownerId: userId,
            },
        });
        if (!task) {
            return null; // Task not found or user not authorized
        }
        // Delete the task (we know it exists and belongs to user)
        return db_1.default.task.delete({
            where: { id: taskId },
        });
    }
    /**
     * Toggle task completion status
     * @param taskId - Task ID
     * @returns Updated task object or null if not found
     */
    async toggleTaskCompletion(taskId) {
        // Get current task to check completion status (security check included)
        const task = await this.getTaskById(taskId);
        if (!task)
            return null;
        logger_1.default.info(`Toggling completion status for task ID: ${taskId}`);
        // Update task with opposite completion status
        return db_1.default.task.update({
            where: { id: taskId },
            data: { completed: !task.completed },
        });
    }
}
exports.TaskService = TaskService;
// Export singleton instance for dependency injection
exports.taskService = new TaskService();
