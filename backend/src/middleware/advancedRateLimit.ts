import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import { Request, Response } from 'express';

// Create Redis store for rate limiting
const redisStore = new RedisStore({
  sendCommand: (...args: string[]) => redis.call(...args),
});

// Different rate limits for different user types
export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    store: redisStore,
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: options.message
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise IP
      return (req as any).user?.id || req.ip;
    }
  });
};

// Tiered rate limiting based on user type
export const tieredRateLimit = rateLimit({
  store: redisStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: Request) => {
    const user = (req as any).user;
    
    if (user?.membershipLevel === 'plus') {
      return 500; // Plus members get higher limits
    } else if (user) {
      return 200; // Authenticated users
    } else {
      return 100; // Anonymous users
    }
  },
  message: (req: Request) => {
    const user = (req as any).user;
    const limit = user?.membershipLevel === 'plus' ? 500 : user ? 200 : 100;
    
    return {
      success: false,
      error: `Rate limit exceeded. Maximum ${limit} requests per 15 minutes.`,
      retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // seconds
    };
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const user = (req as any).user;
    return user?.id || req.ip;
  }
});

// Specific rate limits for different endpoints
export const authLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later'
});

export const searchLimiter = createRateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: 'Too many search requests, please slow down'
});

export const uploadLimiter = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Upload limit exceeded, please try again later'
});