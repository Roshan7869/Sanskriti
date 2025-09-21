import { Router } from 'express';
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = Router();

// GET /api/locations - Publicly accessible
router.get('/', validatePagination, getLocations);

// GET /api/locations/:id - Publicly accessible
router.get('/:id', getLocationById);

// Protected routes (require authentication for creation, updates, deletion)
// Assuming only admins or specific roles can modify locations
router.post('/', authenticateToken, createLocation);
router.put('/:id', authenticateToken, updateLocation);
router.delete('/:id', authenticateToken, deleteLocation);

export default router;
