import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if env vars exist
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.error('Missing Upstash credentials:');
  console.error('UPSTASH_REDIS_REST_URL:', redisUrl ? 'SET ✓' : 'MISSING ✗');
  console.error('UPSTASH_REDIS_REST_TOKEN:', redisToken ? 'SET ✓' : 'MISSING ✗');
  throw new Error('Upstash Redis credentials not configured');
}

// Create Redis client
const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Create rate limiters
export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/email',
});

export const contactFormRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/contact',
});

export const claimRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/claim',
});