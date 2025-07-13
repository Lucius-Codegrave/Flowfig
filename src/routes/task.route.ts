import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
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

// GET /tasks/:id - Get specific task by ID
router.get('/:id', validateTaskId, getTaskById);

// PUT /tasks/:id - Update task (title, description, completed status)
router.put('/:id', validateTaskId, validateUpdateTask, updateTask);

// DELETE /tasks/:id - Delete task permanently
router.delete('/:id', validateTaskId, deleteTask);

/**
 * Special operations
 */

// PATCH /tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', validateTaskId, toggleTaskCompletion);

export default router;
