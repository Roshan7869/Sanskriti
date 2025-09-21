import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/security.js';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// POST /api/auth/register
router.post('/register', validateRegistration, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/verify
// This route is removed as token verification is implicitly handled by authenticated endpoints.
// router.get('/verify', verifyToken);

export default router;