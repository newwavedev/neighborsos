import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Always allow these paths
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/login') ||
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  // Check if user has early access
  try {
    // Get session cookie
    const token = request.cookies.get('sb-access-token')?.value;
    
    if (token) {
      // Create Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email) {
        // Check if user is in whitelist
        const { data: whitelist } = await supabase
          .from('early_access')
          .select('email')
          .eq('email', user.email)
          .single();
        
        if (whitelist) {
          // User is whitelisted - allow access
          return NextResponse.next();
        }
      }
    }
  } catch (error) {
    console.error('Whitelist check error:', error);
  }
  
  // Redirect to coming-soon for everyone else
  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};