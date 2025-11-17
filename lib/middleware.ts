import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow admin access (you can test while it's locked)
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return NextResponse.next();
  }
  
  // Allow coming-soon page itself
  if (pathname.startsWith('/coming-soon')) {
    return NextResponse.next();
  }
  
  // Allow API routes (for admin panel to work)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Redirect everything else to coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};