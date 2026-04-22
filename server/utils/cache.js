// ✅ Redis Caching Utility

const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

// Cache middleware
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;

    redisClient.get(cacheKey, (err, data) => {
      if (err) {
        console.error('Cache error:', err);
        return next(); // Continue without cache if error
      }

      if (data) {
        console.log('Cache hit for:', cacheKey);
        return res.json(JSON.parse(data));
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = function(body) {
        redisClient.setex(cacheKey, ttl, JSON.stringify(body), (err) => {
          if (err) {
            console.error('Cache set error:', err);
          }
        });
        return originalJson(body);
      };

      next();
    });
  };
};

// Invalidate cache
const invalidateCache = (patterns = ['*']) => {
  redisClient.keys(`cache:${patterns[0]}`, (err, keys) => {
    if (err) {
      console.error('Cache invalidation error:', err);
      return;
    }

    if (keys && keys.length > 0) {
      redisClient.del(keys, (err) => {
        if (err) {
          console.error('Cache deletion error:', err);
        } else {
          console.log('✅ Cache invalidated for', keys.length, 'keys');
        }
      });
    }
  });
};

// Get from cache
const getFromCache = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) reject(err);
      else resolve(data ? JSON.parse(data) : null);
    });
  });
};

// Set in cache
const setCache = (key, value, ttl = 300) => {
  return new Promise((resolve, reject) => {
    redisClient.setex(key, ttl, JSON.stringify(value), (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

// Delete from cache
const deleteCache = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

module.exports = {
  redisClient,
  cacheMiddleware,
  invalidateCache,
  getFromCache,
  setCache,
  deleteCache
};
