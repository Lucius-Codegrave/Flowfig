import prisma from '../config/db';

/**
 * Task data for creating a new task
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  userId: number;
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
    return prisma.task.create({
      data: taskData,
    });
  }

  /**
   * Get all tasks for a specific user
   * @param userId - User ID
   * @returns Array of tasks for the user
   */
  async getTasksByUserId(userId: number) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Most recent tasks first
    });
  }

  /**
   * Get a specific task by ID and user ID
   * @param taskId - Task ID
   * @param userId - User ID (for security)
   * @returns Task object or null if not found
   */
  async getTaskById(taskId: number, userId: number) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId, // Ensure user can only access their own tasks
      },
    });
  }

  /**
   * Update a task
   * @param taskId - Task ID
   * @param userId - User ID (for security)
   * @param updateData - Data to update
   * @returns Updated task object or null if not found
   */
  async updateTask(taskId: number, userId: number, updateData: UpdateTaskData) {
    // Update task using updateMany for security (only user's own tasks)
    return prisma.task.updateMany({
      where: {
        id: taskId,
        userId: userId, // Ensure user can only update their own tasks
      },
      data: updateData,
    });
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @param userId - User ID (for security)
   * @returns Deleted task count
   */
  async deleteTask(taskId: number, userId: number) {
    return prisma.task.deleteMany({
      where: {
        id: taskId,
        userId: userId, // Ensure user can only delete their own tasks
      },
    });
  }

  /**
   * Toggle task completion status
   * @param taskId - Task ID
   * @param userId - User ID (for security)
   * @returns Updated task object or null if not found
   */
  async toggleTaskCompletion(taskId: number, userId: number) {
    // Get current task to check completion status
    const task = await this.getTaskById(taskId, userId);
    if (!task) return null;

    // Update task with opposite completion status
    return prisma.task.update({
      where: { id: taskId },
      data: { completed: !task.completed },
    });
  }
}

// Export singleton instance for dependency injection
export const taskService = new TaskService();
