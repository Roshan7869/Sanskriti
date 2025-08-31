import { Router } from 'express';
import {
  getReporters,
  getReporterById,
  createReporter
} from '../controllers/reporterController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = Router();

// GET /api/reporters
router.get('/', validatePagination, getReporters);

// GET /api/reporters/:id
router.get('/:id', getReporterById);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/reporters
router.post('/', createReporter);

export default router;