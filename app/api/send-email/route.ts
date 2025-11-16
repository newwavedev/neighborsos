import { NextRequest, NextResponse } from 'next/server';
import { emailRateLimiter } from '@/lib/rate-limit';

// Helper to get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

// Helper to sanitize email content
function sanitizeInput(input: string): string {
  // Remove potential XSS and script tags
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = getClientIp(request);
    
    // Check rate limit
    const { success, limit, reset, remaining } = await emailRateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          limit,
          reset: new Date(reset).toISOString(),
          remaining
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { to, subject, html, apiKey } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(to)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Optional: Verify API key for internal requests
    // This adds an extra layer of security
    const expectedApiKey = process.env.EMAIL_API_SECRET;
    if (apiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedHtml = sanitizeInput(html);

    // Validate content length
    if (sanitizedHtml.length > 50000) {
      return NextResponse.json(
        { error: 'Email content too large' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'NeighborSOS <noreply@neighborsos.org>',
        to: [to],
        subject: sanitizedSubject,
        html: sanitizedHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return NextResponse.json(
        { error: 'Failed to send email', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        messageId: data.id,
        remaining 
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}