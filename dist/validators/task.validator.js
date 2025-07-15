"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
/**
 * Validation schema for creating a task
 */
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must not exceed 100 characters')
        .trim(),
    description: zod_1.z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
});
/**
 * Validation schema for updating a task
 */
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title must not be empty')
        .max(100, 'Title must not exceed 100 characters')
        .trim()
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
    completed: zod_1.z.boolean().optional(),
});
