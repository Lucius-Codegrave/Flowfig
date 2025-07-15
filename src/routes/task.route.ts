import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  grantPermission,
  revokePermission,
} from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  validateCreateTask,
  validateUpdateTask,
} from '../middlewares/validation.middleware';

const router = Router();

/**
 * Task management routes
 * All routes require authentication via JWT token
 */

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * CRUD operations for tasks
 * Users can only access their own tasks (enforced by service layer)
 */

// POST /tasks - Create a new task
router.post('/', validateCreateTask, createTask);

// GET /tasks - Get all tasks for authenticated user
router.get('/', getTasks);

// GET /task/:id - Get specific task by ID
router.get('/:id', getTaskById);

// PUT /task/:id - Update task (title, description, completed status)
router.put('/:id', validateUpdateTask, updateTask);

// DELETE /task/:id - Delete task permanently
router.delete('/:id', deleteTask);

/**
 * Special operations
 */

// PATCH /tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', toggleTaskCompletion);

/**
 * Task permissions management
 * Admins can grant/revoke permissions to other users
 * Users can only manage their own permission
 */

// POST /tasks/:id/permissions/:userId - Grant permission to a user
router.post('/:id/permissions/:userId', grantPermission);

// DELETE /tasks/:id/permissions/:userId - Revoke permission from a user
router.delete('/:id/permissions/:userId', revokePermission);

export default router;
