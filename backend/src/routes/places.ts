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
import { cacheMiddleware } from '../middleware/cache.js';
import { performanceMonitor } from '../middleware/monitoring.js';

const router = Router();

// Apply performance monitoring
router.use(performanceMonitor);

// GET /api/places
router.get('/', 
  validatePagination, 
  cacheMiddleware('places', { 
    ttl: 600, // 10 minutes cache
    skipCache: (req) => !!req.headers.authorization
  }), 
  getPlaces
);

// GET /api/places/:id
router.get('/:id', 
  cacheMiddleware('place', { ttl: 1800 }), // 30 minutes cache
  getPlaceById
);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/places
router.post('/', createPlace);

// PUT /api/places/:id
router.put('/:id', updatePlace);

// DELETE /api/places/:id
router.delete('/:id', deletePlace);

export default router;