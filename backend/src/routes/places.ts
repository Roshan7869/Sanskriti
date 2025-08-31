import { Router } from 'express';
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} from '../controllers/placeController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = Router();

// GET /api/places
router.get('/', validatePagination, getPlaces);

// GET /api/places/:id
router.get('/:id', getPlaceById);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/places
router.post('/', createPlace);

// PUT /api/places/:id
router.put('/:id', updatePlace);

// DELETE /api/places/:id
router.delete('/:id', deletePlace);

export default router;