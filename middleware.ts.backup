import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Always allow these paths
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/register-charity') ||
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  // Check if user has early access
  try {
    // Try to get the session from various possible cookie names
    const allCookies = request.cookies.getAll();
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.includes('supabase') || 
      cookie.name.includes('sb-') ||
      cookie.name.includes('auth-token')
    );
    
    console.log('All cookies:', allCookies.map(c => c.name)); // Debug log
    console.log('Supabase cookies:', supabaseCookies); // Debug log
    
    // Get the access token from cookies
    let accessToken = request.cookies.get('sb-access-token')?.value ||
                     request.cookies.get('sb-localhost-auth-token')?.value;
    
    // If still no token, try to find it in any supabase cookie
    if (!accessToken && supabaseCookies.length > 0) {
      // Try to extract from the auth-token cookie
      const authTokenCookie = allCookies.find(c => 
        c.name.includes('auth-token') && c.value
      );
      if (authTokenCookie) {
        try {
          const parsed = JSON.parse(authTokenCookie.value);
          accessToken = parsed.access_token || parsed[0];
        } catch (e) {
          console.log('Could not parse auth token cookie');
        }
      }
    }
    
    console.log('Access token found:', !!accessToken); // Debug log
    
    if (accessToken) {
      // Create Supabase client with the access token
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Get user with the token
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
      
      console.log('User check:', user?.email, userError); // Debug log
      
      if (user?.email) {
        // Check if user is in whitelist
        const { data: whitelist, error: whitelistError } = await supabase
          .from('early_access')
          .select('email')
          .eq('email', user.email)
          .single();
        
        console.log('Whitelist check:', whitelist, whitelistError); // Debug log
        
        if (whitelist) {
          console.log('User is whitelisted! Allowing access'); // Debug log
          // User is whitelisted - allow access
          return NextResponse.next();
        } else {
          console.log('User NOT in whitelist'); // Debug log
        }
      }
    } else {
      console.log('No access token found'); // Debug log
    }
  } catch (error) {
    console.error('Whitelist check error:', error);
  }
  
  // Redirect to coming-soon for everyone else
  console.log('Redirecting to coming-soon'); // Debug log
  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};