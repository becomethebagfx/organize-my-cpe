import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
}

// API-specific limits
const apiLimits: Record<string, RateLimitConfig> = {
  '/api/upload': { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
  '/api/exports': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 exports per minute
  '/api/stripe/checkout': { windowMs: 60 * 1000, maxRequests: 5 }, // 5 checkout attempts per minute
}

function getClientIdentifier(request: NextRequest): string {
  // Use Clerk user ID if available, otherwise fall back to IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0].trim() || 'unknown'
  return ip
}

function getConfigForPath(pathname: string): RateLimitConfig {
  for (const [path, config] of Object.entries(apiLimits)) {
    if (pathname.startsWith(path)) {
      return config
    }
  }
  return defaultConfig
}

export function checkRateLimit(request: NextRequest): {
  allowed: boolean
  remaining: number
  resetIn: number
} {
  const now = Date.now()
  const clientId = getClientIdentifier(request)
  const pathname = request.nextUrl.pathname
  const config = getConfigForPath(pathname)
  const key = `${clientId}:${pathname}`

  const entry = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests. Please try again later.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(resetIn / 1000)),
      },
    }
  )
}

// Wrapper for API route handlers
export function withRateLimit<T>(
  handler: (request: NextRequest, context: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const { allowed, remaining, resetIn } = checkRateLimit(request)

    if (!allowed) {
      return rateLimitResponse(resetIn)
    }

    const response = await handler(request, context)

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetIn / 1000)))

    return response
  }
}
