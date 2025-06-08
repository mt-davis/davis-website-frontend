import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
  'https://optimistic-actor-4a3a244025.strapiapp.com',
  process.env.NEXT_PUBLIC_STRAPI_API_URL,
  'http://localhost:3000',
  'http://localhost:1337',
];

// Middleware function
export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Get the response
  const response = NextResponse.next();

  // Only add CORS headers if it's an API route
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Check if the origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    // Add other CORS headers
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  }

  // Add security headers for all routes
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add strict CSP header for HTML responses
  if (!request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com *.vercel-analytics.com hcaptcha.com *.hcaptcha.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: blob: *.strapiapp.com https://*.googleusercontent.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "connect-src 'self' *.vercel-insights.com *.vercel-analytics.com hcaptcha.com *.hcaptcha.com optimistic-actor-4a3a244025.strapiapp.com; " +
      "frame-src hcaptcha.com *.hcaptcha.com;"
    );
  }

  return response;
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to all page routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 