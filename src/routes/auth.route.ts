import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import {
  validateRegistration,
  validateLogin,
} from '../middlewares/validation.middleware';

const router = Router();

/**
 * Authentication routes
 * All routes are public (no authentication required)
 */

// POST /auth/register - Register a new user account
router.post('/register', validateRegistration, register);

// POST /auth/login - Login with email and password
router.post('/login', validateLogin, login);

export default router;
