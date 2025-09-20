import { Router } from 'express';
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import placeRoutes from './places.js';
import influencerRoutes from './influencers.js';
import reporterRoutes from './reporters.js';
import profileRoutes from './profile.js';
import searchRoutes from './search.js';
import reelRoutes from './reels.js';
import membershipRoutes from './membership.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SANSKRITI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/places', placeRoutes);
router.use('/influencers', influencerRoutes);
router.use('/reporters', reporterRoutes);
router.use('/profile', profileRoutes);
router.use('/search', searchRoutes);
router.use('/reels', reelRoutes);
router.use('/membership', membershipRoutes);

export default router;