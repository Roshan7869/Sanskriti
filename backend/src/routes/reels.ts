import { Router } from 'express';
import {
  getReels,
  createReel,
  approveReel,
  deleteReel
} from '../controllers/reelController.js';
import { authenticateToken } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// GET /api/reels
router.get('/', getReels);

// Protected routes (require authentication)
router.use(authenticateToken);

// POST /api/reels
router.post('/', [
  body('reelUrl')
    .isURL()
    .matches(/^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/)
    .withMessage('Please provide a valid Instagram post or reel URL'),
  body('caption')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Caption must be between 1 and 500 characters'),
  body('locationId')
    .optional()
    .isMongoId()
    .withMessage('Invalid location ID'),
  body('eventId')
    .optional()
    .isMongoId()
    .withMessage('Invalid event ID'),
  handleValidationErrors
], createReel);

// PATCH /api/reels/:id/approve
router.patch('/:id/approve', approveReel);

// DELETE /api/reels/:id
router.delete('/:id', deleteReel);

export default router;