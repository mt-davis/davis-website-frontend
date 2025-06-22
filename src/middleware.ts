import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * List of allowed origins for CORS.
 * These origins are permitted to make requests to our API endpoints.
 * @constant {string[]}
 */
const allowedOrigins = [
  'https://optimistic-actor-4a3a244025.strapiapp.com',
  process.env.NEXT_PUBLIC_STRAPI_API_URL,
  'http://localhost:3000',
  'http://localhost:1337',
];

/**
 * Next.js Middleware function that handles:
 * 1. CORS (Cross-Origin Resource Sharing) for API routes
 * 2. Security headers for all routes
 * 3. Content Security Policy (CSP) for non-API routes
 * 
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} The modified response with added headers
 */
export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Get the response
  const response = NextResponse.next();

  /**
   * CORS Headers Section
   * Only applied to API routes (/api/*)
   * Handles cross-origin requests and preflight checks
   */
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

  /**
   * Basic Security Headers Section
   * Applied to all routes
   * Provides protection against common web vulnerabilities
   */
  response.headers.set('X-Content-Type-Options', 'nosniff');  // Prevents MIME type sniffing
  response.headers.set('X-Frame-Options', 'DENY');           // Prevents clickjacking
  response.headers.set('X-XSS-Protection', '1; mode=block'); // Legacy XSS protection
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // Controls referrer information

  /**
   * Content Security Policy (CSP) Section
   * Only applied to non-API routes
   * Defines allowed sources for various types of content
   * 
   * Allowed sources include:
   * - Scripts: self, inline, Cloudflare Turnstile, Vercel analytics
   * - Styles: self, inline, Google Fonts
   * - Images: self, blob, data URIs, Cloudflare, Strapi, Google
   * - Fonts: self, data URIs, Google Fonts
   * - Frames: self, Cloudflare Turnstile
   * - Connections: self, Cloudflare, Vercel, Strapi
   */
  if (!request.nextUrl.pathname.startsWith('/api')) {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://*.turnstile.com *.vercel-insights.com *.vercel-analytics.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://*.cloudflare.com *.strapiapp.com https://*.googleusercontent.com;
      font-src 'self' data: https://fonts.gstatic.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      frame-src 'self' https://challenges.cloudflare.com https://*.turnstile.com;
      connect-src 'self' https://challenges.cloudflare.com https://*.turnstile.com *.vercel-insights.com *.vercel-analytics.com optimistic-actor-4a3a244025.strapiapp.com;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
  }

  /**
   * Permissions Policy Section
   * Applied to all routes
   * Explicitly disables access to sensitive browser features
   */
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort()'
  );

  return response;
}

/**
 * Middleware Configuration
 * Defines which routes the middleware should run on
 * 
 * Applies to:
 * 1. All API routes (/api/*)
 * 2. All page routes except:
 *    - Static files (_next/static)
 *    - Image optimization files (_next/image)
 *    - Favicon
 *    - Prefetch requests
 * 
 * @type {Object}
 */
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to all page routes with exceptions
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}; 