"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_1 = __importDefault(require("./logger"));
/**
 * Express application setup for Flowfig API
 * Handles task management with user authentication
 */
const app = (0, express_1.default)();
/**
 * Middleware configuration
 */
// CORS middleware - Allow specific frontend origins to call API
app.use((0, cors_1.default)({
    origin: env_1.CORS_ORIGINS, // Configurable allowed origins
    credentials: true, // Allow cookies and auth headers
}));
// Body parser middleware - Parse JSON requests
app.use(express_1.default.json());
/**
 * Route definitions
 */
// Health check endpoint
app.get('/', (_req, res) => {
    res.send('Flowfig API is alive 🌱');
});
// Authentication routes (register, login)
app.use('/auth', auth_route_1.default);
// Task management routes (CRUD operations)
app.use('/tasks', task_route_1.default);
/**
 * Error handling
 */
// Global error handling middleware (must be registered last)
app.use(error_middleware_1.errorHandler);
/**
 * Start server
 */
app.listen(env_1.PORT, () => {
    logger_1.default.info('✅ Flowfig running on http://localhost:${PORT}');
});
