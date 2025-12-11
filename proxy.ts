import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log('Proxy middleware - Path:', path);
  
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
    '/api/auth/logout',
    '/api/products',
    '/api/debug',
  ];

  // Check if path is public
  const isPublicPath = publicPaths.includes(path) || 
      path.startsWith('/_next/') || 
      path.startsWith('/static/') ||
      path.startsWith('/public/') ||
      path.startsWith('/api/auth/') ||
      (path.startsWith('/api/products') && request.method === 'GET');

  if (isPublicPath) {
    console.log('Public path, allowing access');
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('ghoroa-token')?.value;
  console.log('Token in cookie:', token ? 'Present' : 'Missing');

  // Check for API routes
  if (path.startsWith('/api/')) {
    if (!token) {
      console.log('No token for API route, returning 401');
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token for API route, returning 401');
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    console.log('API token verified, user ID:', decoded.userId);
    
    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For protected page routes, check auth token
  const protectedPages = [
    '/account',
    '/cart', 
    '/checkout',
    '/admin',
  ];

  const isProtectedPage = protectedPages.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  if (isProtectedPage) {
    console.log('Protected page access attempt:', path);
    
    if (!token) {
      console.log('No token, redirecting to login');
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Invalid token, redirecting to login');
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('ghoroa-token');
      return response;
    }

    console.log('Page access granted for user:', decoded.userId);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific paths
    '/account/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    // Protect API routes except auth and public ones
    '/api/orders/:path*',
    '/api/users/:path*',
    '/api/admin/:path*',
    '/api/cart/:path*',
  ],
};