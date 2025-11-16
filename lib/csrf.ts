import { cookies } from 'next/headers';
import Tokens from 'csrf';

const tokens = new Tokens();

// Generate a CSRF token
export function generateCsrfToken(): { token: string; secret: string } {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  
  return { token, secret };
}

// Verify a CSRF token
export function verifyCsrfToken(token: string, secret: string): boolean {
  return tokens.verify(secret, token);
}

// Get CSRF secret from cookies (server-side)
export async function getCsrfSecret(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('csrf-secret')?.value || null;
}