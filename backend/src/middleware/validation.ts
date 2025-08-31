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
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('region')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Region cannot exceed 100 characters'),
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
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('category')
    .isIn([
      'Cultural Event',
      'State Festival', 
      'Traditional Festival',
      'Religious Festival',
      'Art & Culture',
      'Historical Tour',
      'Workshop',
      'Exhibition'
    ])
    .withMessage('Invalid category'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('coordinates.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('date')
    .isISO8601()
    .toDate()
    .custom((date: Date) => {
      if (date <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('imageUrl')
    .isURL()
    .withMessage('Please provide a valid image URL'),
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
    .isIn(['events', 'places', 'all'])
    .withMessage('Search type must be events, places, or all'),
  handleValidationErrors
];

export const validateEventQuery = [
  ...validatePagination,
  ...validateSearch,
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO format (YYYY-MM-DD)'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category cannot be empty'),
  query('location')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Location cannot be empty'),
  handleValidationErrors
];