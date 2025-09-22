import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateEventCreation, validateEventQuery } from '../middleware/validation.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { performanceMonitor } from '../middleware/monitoring.js';

const router = Router();

// Apply performance monitoring to all routes
router.use(performanceMonitor);

// GET /api/events
router.get('/', 
  validateEventQuery, 
  cacheMiddleware('events', { 
    ttl: 300, // 5 minutes cache
    skipCache: (req) => !!req.headers.authorization // Skip cache for authenticated users
  }), 
  getEvents
);

// GET /api/events/:id
router.get('/:id', 
  cacheMiddleware('event', { ttl: 600 }), // 10 minutes cache
  getEventById
);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/events
router.post('/', validateEventCreation, createEvent);

// PUT /api/events/:id
router.put('/:id', validateEventCreation, updateEvent);

// DELETE /api/events/:id
router.delete('/:id', deleteEvent);

export default router;