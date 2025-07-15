"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const router = (0, express_1.Router)();
/**
 * Authentication routes
 * All routes are public (no authentication required)
 */
// POST /auth/register - Register a new user account
router.post('/register', validation_middleware_1.validateRegistration, auth_controller_1.register);
// POST /auth/login - Login with email and password
router.post('/login', validation_middleware_1.validateLogin, auth_controller_1.login);
exports.default = router;
