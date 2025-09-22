import { Request, Response, NextFunction } from 'express';
import { cacheUtils } from '../config/redis.js';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
}

export const cacheMiddleware = (prefix: string, options: CacheOptions = {}) => {
  const { ttl = 300, keyGenerator, skipCache } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for authenticated requests or specific conditions
    if (skipCache && skipCache(req)) {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator 
      ? keyGenerator(req)
      : cacheUtils.generateKey(prefix, { ...req.query, ...req.params });

    try {
      // Try to get cached data
      const cachedData = await cacheUtils.get(cacheKey);
      
      if (cachedData) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`Cache MISS: ${cacheKey}`);

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache the response
      res.json = function(data: any) {
        // Only cache successful responses
        if (res.statusCode === 200 && data.success) {
          cacheUtils.set(cacheKey, data, ttl).catch(console.error);
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation utility
export const invalidateCache = async (patterns: string[]) => {
  try {
    for (const pattern of patterns) {
      const keys = await cacheUtils.redis.keys(pattern);
      if (keys.length > 0) {
        await cacheUtils.redis.del(...keys);
        console.log(`Invalidated ${keys.length} cache keys for pattern: ${pattern}`);
      }
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};