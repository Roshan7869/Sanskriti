import { Router } from 'express';
import { search } from '../controllers/searchController.js';
import { validateSearch, validatePagination } from '../middleware/validation.js';

const router = Router();

// GET /api/search
router.get('/', [...validateSearch, ...validatePagination], search);

export default router;