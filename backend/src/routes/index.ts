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
import { performanceMetrics } from '../middleware/monitoring.js';
import { checkDatabaseHealth } from '../utils/databaseOptimization.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  const metrics = performanceMetrics.getMetrics();
  
  res.json({
    success: true,
    message: 'SANSKRITI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: dbHealth,
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: Object.keys(metrics).length > 0 ? metrics : 'No metrics available'
    }
  });
});

// Metrics endpoint (protected in production)
router.get('/metrics', (req, res) => {
  if (process.env.NODE_ENV === 'production' && req.headers.authorization !== `Bearer ${process.env.METRICS_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({
    success: true,
    data: performanceMetrics.getMetrics()
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