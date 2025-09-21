import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// Auth validation rules
export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Event validation rules
export const validateEventCreation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Name must be between 3 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('type')
    .isIn(['festival', 'celebration', 'pandal', 'event'])
    .withMessage('Invalid event type'),
  body('images').isArray({ min: 1 }).withMessage('At least one image URL is required'),
  body('images.*').isURL().withMessage('Each image must be a valid URL'),
  handleValidationErrors
];

// Query validation rules
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

export const validateSearch = [
  query('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('type')
    .optional()
    .isIn(['events', 'locations', 'members', 'all'])
    .withMessage('Search type must be valid'),
  handleValidationErrors
];

export const validateEventQuery = [
  ...validatePagination,
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO format (YYYY-MM-DD)'),
  query('type')
    .optional()
    .isIn(['festival', 'celebration', 'pandal', 'event'])
    .withMessage('Invalid event type'),
  handleValidationErrors
];