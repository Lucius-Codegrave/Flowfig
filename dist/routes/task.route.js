"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
/**
 * Task management routes
 * All routes require authentication via JWT token
 */
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authenticateToken);
/**
 * CRUD operations for tasks
 * Users can only access their own tasks (enforced by service layer)
 */
// POST /tasks - Create a new task
router.post('/', validation_middleware_1.validateCreateTask, task_controller_1.createTask);
// GET /tasks - Get all tasks for authenticated user
router.get('/', task_controller_1.getTasks);
// GET /task/:id - Get specific task by ID
router.get('/:id', task_controller_1.getTaskById);
// PUT /task/:id - Update task (title, description, completed status)
router.put('/:id', validation_middleware_1.validateUpdateTask, task_controller_1.updateTask);
// DELETE /task/:id - Delete task permanently
router.delete('/:id', task_controller_1.deleteTask);
/**
 * Special operations
 */
// PATCH /tasks/:id/toggle - Toggle task completion status
router.patch('/:id/toggle', task_controller_1.toggleTaskCompletion);
/**
 * Task permissions management
 * Admins can grant/revoke permissions to other users
 * Users can only manage their own permission
 */
// POST /tasks/:id/permissions/:userId - Grant permission to a user
router.post('/:id/permissions/:userId', task_controller_1.grantPermission);
// DELETE /tasks/:id/permissions/:userId - Revoke permission from a user
router.delete('/:id/permissions/:userId', task_controller_1.revokePermission);
exports.default = router;
