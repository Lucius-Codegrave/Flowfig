import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { asyncHandler } from '../middlewares/error.middleware';
import { CreateTaskRequest } from '../types/task.types';
import { permissionService } from '../services/permission.service';
import { Permission } from '@prisma/client';

/**
 * Create a new task
 * @param req - Authenticated request object with task data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with created task
 */
export const createTask = asyncHandler(
  async (req: Request<{}, {}, CreateTaskRequest>, res: Response) => {
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
    const task = await taskService.createTask({
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
  }
);

/**
 * Get all tasks for current user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with user's tasks
 */
export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user) {
    res.status(401).json({
      message: 'Unauthorized - user not authenticated',
    });
    return;
  }

  const userId = req.user.id;

  // Fetch all tasks for the current user
  const tasks = await taskService.getAccessibleTasks(userId);

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
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
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
  const hasReadPermission = await permissionService.hasPermission(
    taskId,
    userId,
    Permission.READ
  );

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
  const task = await taskService.getTaskById(taskId);

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
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
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
  const hasReadPermission = await permissionService.hasPermission(
    taskId,
    userId,
    Permission.WRITE
  );

  //  If user does not have permission, return 403 Forbidden
  if (!hasReadPermission) {
    res.status(403);
    return;
  }

  // Update task through service layer with user security
  const updatedTask = await taskService.updateTask(taskId, userId, {
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
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
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
  const hasReadPermission = await permissionService.hasPermission(
    taskId,
    userId,
    Permission.WRITE
  );

  //  If user does not have permission, return 403 Forbidden
  if (!hasReadPermission) {
    res.status(403);
    return;
  }

  // Delete task through service layer with user security
  const deleteResult = await taskService.deleteTask(taskId, userId);

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
export const toggleTaskCompletion = asyncHandler(
  async (req: Request, res: Response) => {
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
    const updatedTask = await taskService.toggleTaskCompletion(taskId);

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
  }
);

/**
 * Grant a permission to a user for a specific task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
export const grantPermission = asyncHandler(
  async (req: Request, res: Response) => {
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
    const hasPermission = await permissionService.hasPermission(
      taskId,
      userId,
      Permission.WRITE
    );

    // If user does not have permission, return 403 Forbidden
    if (!hasPermission) {
      res.status(403).json({
        message: 'Forbidden - insufficient permissions',
      });
      return;
    }

    const taskPermission = await permissionService.getPermission(
      taskId,
      targetUserId
    );

    // If permission exists, update it; otherwise create new one
    if (taskPermission) {
      // Update existing permission
      await permissionService.updatePermission(
        taskId,
        targetUserId,
        permission,
        userId
      );

      res.status(200).json({
        message: 'Permission updated successfully',
      });
      return;
    }

    // Grant new permission through service layer
    await permissionService.grantPermission(
      taskId,
      targetUserId,
      permission,
      userId
    );

    // Return success response
    res.status(201).json({
      message: 'Permission granted successfully',
    });
  }
);

/**
 * Revoke a permission from a user for a specific task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with success message or error details
 */
export const revokePermission = asyncHandler(
  async (req: Request, res: Response) => {
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
    const hasPermission = await permissionService.hasPermission(
      taskId,
      userId,
      Permission.WRITE
    );

    // If user does not have permission, return 403 Forbidden
    if (!hasPermission) {
      res.status(403).json({
        message: 'Forbidden - insufficient permissions',
      });
      return;
    }

    // Revoke permission through service layer
    await permissionService.revokePermission(taskId, targetUserId);

    // Return success response
    res.status(200).json({
      message: 'Permission revoked successfully',
    });
  }
);
