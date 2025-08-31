import { Router } from 'express';
import {
  getInfluencers,
  getInfluencerById,
  createInfluencer
} from '../controllers/influencerController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = Router();

// GET /api/influencers
router.get('/', validatePagination, getInfluencers);

// GET /api/influencers/:id
router.get('/:id', getInfluencerById);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/influencers
router.post('/', createInfluencer);

export default router;