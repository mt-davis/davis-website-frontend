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
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.turnstile.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.cloudflare.com;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self' https://challenges.cloudflare.com https://*.turnstile.com;
      connect-src 'self' https://challenges.cloudflare.com https://*.turnstile.com;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
  }

  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to all page routes
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}; 