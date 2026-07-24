// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicAccountPaths = new Set([
  '/account/login',
  '/account/signup',
]);

// Known malicious bot patterns
const maliciousBotPatterns = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /httpclient/i,
  /java\//i,
  /libwww/i,
  /fetch/i,
];

// Rate limiting: Simple in-memory store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

function isMaliciousBot(userAgent: string): boolean {
  return maliciousBotPatterns.some(pattern => pattern.test(userAgent));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
  
  // Block obvious malicious bots
  if (isMaliciousBot(userAgent) && pathname.startsWith('/api')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Apply rate limiting to sensitive routes
  if (pathname.startsWith('/account/login') || pathname.startsWith('/account/signup') || pathname.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '60',
        }
      });
    }
  }

  // Early return for routes we don't care about
  if (!pathname.startsWith('/account')) {
    // Add security headers to all responses
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  const isPublic = publicAccountPaths.has(pathname);

  // Unauthenticated user trying to access protected account page
  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL('/account/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login/signup → redirect to dashboard
  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // Allowed → proceed
  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/account/:path*', '/api/:path*'],
};