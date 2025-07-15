import { Permission } from '@prisma/client';
import prisma from '../config/db';
import logger from '../logger';

/**
 * Task data for creating a new task
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  ownerId: number; // Changed from userId to ownerId
}

/**
 * Task data for updating a task
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Task service handling task-related database operations
 */
export class TaskService {
  /**
   * Create a new task for a user
   * @param taskData - Task data to create
   * @returns Created task object
   */
  async createTask(taskData: CreateTaskData) {
    logger.info(
      `Creating task: ${taskData.title} for owner ID: ${taskData.ownerId}`
    );

    return prisma.task.create({
      data: taskData,
    });
  }

  /**
   * Get all tasks accessible by a user
   * @param userId - User ID to filter tasks
   * @returns List of tasks accessible by the user
   */
  async getAccessibleTasks(userId: number) {
    // Fetch tasks where user is either the owner or has permissions
    return prisma.task.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            permissions: {
              some: {
                userId: userId,
                permission: { in: [Permission.READ, Permission.WRITE] },
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
  async getTaskById(taskId: number) {
    return prisma.task.findUnique({
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
  async updateTask(taskId: number, userId: number, updateData: UpdateTaskData) {
    logger.info(`Updating task ID: ${taskId} for owner ID: ${userId}`);

    // First check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        ownerId: userId,
      },
    });

    if (!task) {
      return null; // Task not found or user not authorized
    }

    // Update the task (we know it exists and belongs to user)
    return prisma.task.update({
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
  async deleteTask(taskId: number, userId: number) {
    logger.info(`Deleting task ID: ${taskId} for owner ID: ${userId}`);

    // First check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        ownerId: userId,
      },
    });

    if (!task) {
      return null; // Task not found or user not authorized
    }

    // Delete the task (we know it exists and belongs to user)
    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  /**
   * Toggle task completion status
   * @param taskId - Task ID
   * @returns Updated task object or null if not found
   */
  async toggleTaskCompletion(taskId: number) {
    // Get current task to check completion status (security check included)
    const task = await this.getTaskById(taskId);
    if (!task) return null;

    logger.info(`Toggling completion status for task ID: ${taskId}`);

    // Update task with opposite completion status
    return prisma.task.update({
      where: { id: taskId },
      data: { completed: !task.completed },
    });
  }
}

// Export singleton instance for dependency injection
export const taskService = new TaskService();
