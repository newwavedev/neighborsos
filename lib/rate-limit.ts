import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Don't create Redis client immediately - wait until it's actually needed
let redis: Redis | null = null;

function getRedis() {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    console.log('Initializing Redis...');
    console.log('URL exists:', !!url);
    console.log('Token exists:', !!token);
    
    if (!url || !token) {
      throw new Error('Upstash Redis credentials not configured');
    }
    
    redis = new Redis({ url, token });
  }
  return redis;
}

// Create rate limiters lazily
let _emailRateLimiter: Ratelimit | null = null;
let _contactFormRateLimiter: Ratelimit | null = null;
let _claimRateLimiter: Ratelimit | null = null;

export const emailRateLimiter = {
  limit: async (key: string) => {
    if (!_emailRateLimiter) {
      _emailRateLimiter = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        analytics: true,
        prefix: '@upstash/ratelimit/email',
      });
    }
    return _emailRateLimiter.limit(key);
  }
};

export const contactFormRateLimiter = {
  limit: async (key: string) => {
    if (!_contactFormRateLimiter) {
      _contactFormRateLimiter = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: '@upstash/ratelimit/contact',
      });
    }
    return _contactFormRateLimiter.limit(key);
  }
};

export const claimRateLimiter = {
  limit: async (key: string) => {
    if (!_claimRateLimiter) {
      _claimRateLimiter = new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        analytics: true,
        prefix: '@upstash/ratelimit/claim',
      });
    }
    return _claimRateLimiter.limit(key);
  }
};