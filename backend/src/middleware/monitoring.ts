import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Configure Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sanskriti-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    logger.info('HTTP Request', {
      method,
      url,
      statusCode,
      duration,
      ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow Request', {
        method,
        url,
        duration,
        statusCode
      });
    }
  });

  next();
};

// Performance metrics
export const performanceMetrics = {
  requestCount: new Map<string, number>(),
  responseTime: new Map<string, number[]>(),
  errorCount: new Map<string, number>(),

  recordRequest: (endpoint: string) => {
    const current = performanceMetrics.requestCount.get(endpoint) || 0;
    performanceMetrics.requestCount.set(endpoint, current + 1);
  },

  recordResponseTime: (endpoint: string, time: number) => {
    const times = performanceMetrics.responseTime.get(endpoint) || [];
    times.push(time);
    // Keep only last 100 measurements
    if (times.length > 100) times.shift();
    performanceMetrics.responseTime.set(endpoint, times);
  },

  recordError: (endpoint: string) => {
    const current = performanceMetrics.errorCount.get(endpoint) || 0;
    performanceMetrics.errorCount.set(endpoint, current + 1);
  },

  getMetrics: () => {
    const metrics: any = {};
    
    for (const [endpoint, count] of performanceMetrics.requestCount) {
      const times = performanceMetrics.responseTime.get(endpoint) || [];
      const errors = performanceMetrics.errorCount.get(endpoint) || 0;
      
      metrics[endpoint] = {
        requests: count,
        errors,
        avgResponseTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
        maxResponseTime: times.length > 0 ? Math.max(...times) : 0,
        errorRate: count > 0 ? (errors / count) * 100 : 0
      };
    }
    
    return metrics;
  }
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const endpoint = `${req.method} ${req.route?.path || req.path}`;
  
  performanceMetrics.recordRequest(endpoint);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceMetrics.recordResponseTime(endpoint, duration);
    
    if (res.statusCode >= 400) {
      performanceMetrics.recordError(endpoint);
    }
  });
  
  next();
};