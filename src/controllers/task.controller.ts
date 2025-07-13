import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { taskService } from '../services/task.service';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Create a new task
 * @param req - Authenticated request object with task data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with created task
 */
export const createTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID from authenticated request
    const userId = req.user!.id;

    // Extract validated task data from request body
    const { title, description } = req.body;

    // Create task through service layer
    const task = await taskService.createTask({
      title,
      description,
      userId,
    });

    // Return success response with created task
    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  }
);

/**
 * Get all tasks for current user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with user's tasks
 */
export const getTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID from authenticated request
    const userId = req.user!.id;

    // Fetch all tasks for the current user
    const tasks = await taskService.getTasksByUserId(userId);

    // Return tasks with count for convenience
    res.status(200).json({
      tasks,
      count: tasks.length,
    });
  }
);

/**
 * Get a specific task by ID
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with task details
 */
export const getTaskById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID and task ID from request
    const userId = req.user!.id;
    const taskId = parseInt(req.params.id);

    // Validate task ID is a valid number
    if (isNaN(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    // Fetch task with user security check
    const task = await taskService.getTaskById(taskId, userId);

    // Return 404 if task not found or doesn't belong to user
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // Return found task
    res.status(200).json({ task });
  }
);

/**
 * Update a task
 * @param req - Authenticated request object with task ID and update data
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with update result
 */
export const updateTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID, task ID, and update data
    const userId = req.user!.id;
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    // Validate task ID is a valid number
    if (isNaN(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    // Update task through service layer with user security
    const updateResult = await taskService.updateTask(taskId, userId, {
      title,
      description,
      completed,
    });

    // Check if task was found and updated
    if (updateResult.count === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // Fetch updated task to return complete data
    const updatedTask = await taskService.getTaskById(taskId, userId);

    // Return success response with updated task
    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  }
);

/**
 * Delete a task
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with deletion result
 */
export const deleteTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID and task ID from request
    const userId = req.user!.id;
    const taskId = parseInt(req.params.id);

    // Validate task ID is a valid number
    if (isNaN(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    // Delete task through service layer with user security
    const deleteResult = await taskService.deleteTask(taskId, userId);

    // Check if task was found and deleted
    if (deleteResult.count === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // Return success response
    res.status(200).json({
      message: 'Task deleted successfully',
    });
  }
);

/**
 * Toggle task completion status
 * @param req - Authenticated request object with task ID in params
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns JSON response with updated task
 */
export const toggleTaskCompletion = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extract user ID and task ID from request
    const userId = req.user!.id;
    const taskId = parseInt(req.params.id);

    // Validate task ID is a valid number
    if (isNaN(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    // Toggle completion status through service layer
    const updatedTask = await taskService.toggleTaskCompletion(taskId, userId);

    // Check if task was found and updated
    if (!updatedTask) {
      return res.status(404).json({
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
