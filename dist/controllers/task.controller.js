"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokePermission = exports.grantPermission = exports.toggleTaskCompletion = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const error_middleware_1 = require("../middlewares/error.middleware");
const permission_service_1 = require("../services/permission.service");
const client_1 = require("@prisma/client");
/**
 * Create a new task
 * @param req - Authenticated request object with task data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with created task
 */
exports.createTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    const { title, description } = req.body;
    // Create task through service layer
    const task = await task_service_1.taskService.createTask({
        title,
        description,
        ownerId: userId,
    });
    // Return success response with created task
    res.status(201).json({
        message: 'Task created successfully',
        task,
    });
    return;
});
/**
 * Get all tasks for current user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with user's tasks
 */
exports.getTasks = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    // Fetch all tasks for the current user
    const tasks = await task_service_1.taskService.getAccessibleTasks(userId);
    // Return tasks with count for convenience
    res.status(200).json({
        tasks,
        count: tasks.length,
    });
});
/**
 * Get a specific task by ID
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with task details
 */
exports.getTaskById = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    // Check if user has permission to read the task
    const hasReadPermission = await permission_service_1.permissionService.hasPermission(taskId, userId, client_1.Permission.READ);
    //  If user does not have permission, return 403 Forbidden
    if (!hasReadPermission) {
        res.status(403);
        return;
    }
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
    }
    // Fetch task with user security check
    const task = await task_service_1.taskService.getTaskById(taskId);
    // Return 404 if task not found or doesn't belong to user
    if (!task) {
        res.status(404).json({
            message: 'Task not found',
        });
    }
    // Return found task
    res.status(200).json({ task });
});
/**
 * Update a task
 * @param req - Authenticated request object with task ID and update data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with update result
 */
exports.updateTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
    }
    // Check if user has permission to update the task
    const hasReadPermission = await permission_service_1.permissionService.hasPermission(taskId, userId, client_1.Permission.WRITE);
    //  If user does not have permission, return 403 Forbidden
    if (!hasReadPermission) {
        res.status(403);
        return;
    }
    // Update task through service layer with user security
    const updatedTask = await task_service_1.taskService.updateTask(taskId, userId, {
        title,
        description,
        completed,
    });
    // Check if task was found and updated
    if (!updatedTask) {
        res.status(404).json({
            message: 'Task not found',
        });
        return;
    }
    // Return success response with updated task
    res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask,
    });
});
/**
 * Delete a task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with deletion result
 */
exports.deleteTask = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
    }
    // Check if user has permission to delete the task
    const hasReadPermission = await permission_service_1.permissionService.hasPermission(taskId, userId, client_1.Permission.WRITE);
    //  If user does not have permission, return 403 Forbidden
    if (!hasReadPermission) {
        res.status(403);
        return;
    }
    // Delete task through service layer with user security
    const deleteResult = await task_service_1.taskService.deleteTask(taskId, userId);
    // Check if task was found and deleted
    if (!deleteResult) {
        res.status(404).json({
            message: 'Task not found',
        });
        return;
    }
    // Return success response
    res.status(200).json({
        message: 'Task deleted successfully',
    });
});
/**
 * Toggle task completion status
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with updated task
 */
exports.toggleTaskCompletion = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    // Extract user ID and task ID from request
    const taskId = parseInt(req.params.id);
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
    }
    // Toggle completion status through service layer
    const updatedTask = await task_service_1.taskService.toggleTaskCompletion(taskId);
    // Check if task was found and updated
    if (!updatedTask) {
        res.status(404).json({
            message: 'Task not found',
        });
    }
    // Return success response with updated task
    res.status(200).json({
        message: 'Task completion status updated',
        task: updatedTask,
    });
});
/**
 * Grant a permission to a user for a specific task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
exports.grantPermission = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId);
    const { permission } = req.body;
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
        return;
    }
    // Check if user has permission to grant permissions
    const hasPermission = await permission_service_1.permissionService.hasPermission(taskId, userId, client_1.Permission.WRITE);
    // If user does not have permission, return 403 Forbidden
    if (!hasPermission) {
        res.status(403).json({
            message: 'Forbidden - insufficient permissions',
        });
        return;
    }
    const taskPermission = await permission_service_1.permissionService.getPermission(taskId, targetUserId);
    // If permission exists, update it; otherwise create new one
    if (taskPermission) {
        // Update existing permission
        await permission_service_1.permissionService.updatePermission(taskId, targetUserId, permission, userId);
        res.status(200).json({
            message: 'Permission updated successfully',
        });
        return;
    }
    // Grant new permission through service layer
    await permission_service_1.permissionService.grantPermission(taskId, targetUserId, permission, userId);
    // Return success response
    res.status(201).json({
        message: 'Permission granted successfully',
    });
});
/**
 * Revoke a permission from a user for a specific task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
exports.revokePermission = (0, error_middleware_1.asyncHandler)(async (req, res) => {
    // Ensure user is authenticated
    if (!req.user) {
        res.status(401).json({
            message: 'Unauthorized - user not authenticated',
        });
        return;
    }
    // Extract user ID and task ID from request
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const targetUserId = parseInt(req.params.userId); // ✅ Depuis params
    // Validate task ID is a valid number
    if (isNaN(taskId)) {
        res.status(400).json({
            message: 'Invalid task ID',
        });
        return;
    }
    // Check if user has permission to revoke permissions
    const hasPermission = await permission_service_1.permissionService.hasPermission(taskId, userId, client_1.Permission.WRITE);
    // If user does not have permission, return 403 Forbidden
    if (!hasPermission) {
        res.status(403).json({
            message: 'Forbidden - insufficient permissions',
        });
        return;
    }
    // Revoke permission through service layer
    await permission_service_1.permissionService.revokePermission(taskId, targetUserId);
    // Return success response
    res.status(200).json({
        message: 'Permission revoked successfully',
    });
});
