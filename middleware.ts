import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
// In production, use Redis or another external store for persistent rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Rate limit configuration
const RATE_LIMIT_MAX = 10; // 10 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

/**
 * Get the client IP address from various headers or connection info
 * This handles cases where the app is behind a proxy, load balancer, or CDN
 */
function getClientIp(request: NextRequest): string {
  // Common headers that might contain the client IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'true-client-ip',   // Akamai and Cloudflare
    'x-client-ip',
    'forwarded',
  ];

  // Try to get IP from headers
  for (const header of headers) {
    const headerValue = request.headers.get(header);
    if (headerValue) {
      // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2, ...)
      // Take the first one which should be the client IP
      const ip = headerValue.split(',')[0].trim();
      if (ip) {
        return ip;
      }
    }
  }

  // Fallback to the connection IP or use anonymous if nothing is available
  return request.ip || 'anonymous';
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to the background removal API
  if (request.nextUrl.pathname === '/api/remove-bg') {
    // Get client IP with fallbacks
    const clientIp = getClientIp(request);
    const now = Date.now();
    const requestRecord = rateLimitMap.get(clientIp);

    // Clear expired rate limit data
    Array.from(rateLimitMap.entries()).forEach(([storedIp, data]) => {
      if (now - data.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(storedIp);
      }
    });

    // First request from this IP
    if (!requestRecord) {
      rateLimitMap.set(clientIp, { count: 1, timestamp: now });
      return NextResponse.next();
    }

    // Reset count if the window has elapsed
    if (now - requestRecord.timestamp > RATE_LIMIT_WINDOW) {
      rateLimitMap.set(clientIp, { count: 1, timestamp: now });
      return NextResponse.next();
    }

    // Increment request count
    const updatedCount = requestRecord.count + 1;
    rateLimitMap.set(clientIp, { count: updatedCount, timestamp: requestRecord.timestamp });

    // Check if rate limit exceeded
    if (updatedCount > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.', 
          statusCode: 429,
          message: `Request limit of ${RATE_LIMIT_MAX} per minute exceeded. Please wait before trying again.`,
          retryAfter: Math.ceil((requestRecord.timestamp + RATE_LIMIT_WINDOW - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((requestRecord.timestamp + RATE_LIMIT_WINDOW - now) / 1000).toString(),
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  return NextResponse.next();
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 