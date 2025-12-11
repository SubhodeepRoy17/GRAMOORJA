import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/blog',
    '/auth/login',
    '/auth/signup',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/verify',
    '/api/products',
  ];

  // Check if path is public
  if (publicPaths.includes(path) || 
      path.startsWith('/_next/') || 
      path.startsWith('/static/')) {
    return NextResponse.next();
  }

  // Check for API routes that need auth
  if (path.startsWith('/api/')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('ghoroa-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For page routes, check auth token
  const token = request.cookies.get('ghoroa-token')?.value;
  
  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('ghoroa-token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/api/cart/:path*',
    '/api/orders/:path*',
    '/api/users/:path*',
    '/api/admin/:path*',
  ],
};