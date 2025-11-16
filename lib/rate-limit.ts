import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiters with different limits
export const emailRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 emails per hour per IP
  analytics: true,
  prefix: '@upstash/ratelimit/email',
});

export const contactFormRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 contact forms per hour per IP
  analytics: true,
  prefix: '@upstash/ratelimit/contact',
});

export const claimRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 claims per hour per IP
  analytics: true,
  prefix: '@upstash/ratelimit/claim',
});