import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import taskRoutes from './routes/task.route';
import { PORT, CORS_ORIGINS } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

/**
 * Express application setup for Flowfig API
 * Handles task management with user authentication
 */
const app = express();

/**
 * Middleware configuration
 */

// CORS middleware - Allow specific frontend origins to call API
app.use(
  cors({
    origin: CORS_ORIGINS, // Configurable allowed origins
    credentials: true, // Allow cookies and auth headers
  })
);

// Body parser middleware - Parse JSON requests
app.use(express.json());

/**
 * Route definitions
 */

// Health check endpoint
app.get('/', (_req, res) => {
  res.send('Flowfig API is alive 🌱');
});

// Authentication routes (register, login)
app.use('/auth', authRoutes);

// Task management routes (CRUD operations)
app.use('/tasks', taskRoutes);

/**
 * Error handling
 */

// Global error handling middleware (must be registered last)
app.use(errorHandler);

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`✅ Flowfig running on http://localhost:${PORT}`);
});
