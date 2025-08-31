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

const router = Router();

// GET /api/events
router.get('/', validateEventQuery, getEvents);

// GET /api/events/:id
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/events
router.post('/', validateEventCreation, createEvent);

// PUT /api/events/:id
router.put('/:id', validateEventCreation, updateEvent);

// DELETE /api/events/:id
router.delete('/:id', deleteEvent);

export default router;