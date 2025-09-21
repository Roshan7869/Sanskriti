import { Router } from 'express';
import {
  applyForMembership,
  getApplicationStatus,
  getApplications,
  reviewApplication
} from '../controllers/membershipController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// All membership routes require authentication
router.use(authenticateToken);

// POST /api/membership/apply - Apply for plus membership
router.post('/apply', [
  body('bio')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Bio must be between 10 and 500 characters'),
  body('instagramHandle')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage('Instagram handle can only contain letters, numbers, dots, and underscores'),
  body('sampleWork')
    .optional()
    .isURL()
    .withMessage('Sample work must be a valid URL'),
  handleValidationErrors
], applyForMembership);

// GET /api/membership/status - Check own application status
router.get('/status', getApplicationStatus);

// --- Admin Routes ---

// GET /api/membership/applications - Get all applications (admin only)
router.get('/applications', isAdmin, getApplications);

// PATCH /api/membership/applications/:id/review - Review an application (admin only)
router.patch('/applications/:id/review', isAdmin, [
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either "approved" or "rejected"'),
  body('reviewNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review notes cannot exceed 1000 characters'),
  handleValidationErrors
], reviewApplication);

export default router;
