import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET() {
  const { token, secret } = generateCsrfToken();
  
  const response = NextResponse.json({ csrfToken: token });
  
  // Set the secret in an httpOnly cookie
  response.cookies.set('csrf-secret', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return response;
}