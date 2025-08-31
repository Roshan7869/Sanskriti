import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  addToFavorites,
  removeFromFavorites
} from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// All profile routes require authentication
router.use(authenticateToken);

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile
router.put('/', [
  body('region')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Region cannot exceed 100 characters'),
  handleValidationErrors
], updateProfile);

// POST /api/profile/favorites
router.post('/favorites', [
  body('type')
    .isIn(['events', 'places'])
    .withMessage('Type must be either "events" or "places"'),
  body('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
  handleValidationErrors
], addToFavorites);

// DELETE /api/profile/favorites
router.delete('/favorites', [
  body('type')
    .isIn(['events', 'places'])
    .withMessage('Type must be either "events" or "places"'),
  body('itemId')
    .isMongoId()
    .withMessage('Invalid item ID'),
  handleValidationErrors
], removeFromFavorites);

export default router;