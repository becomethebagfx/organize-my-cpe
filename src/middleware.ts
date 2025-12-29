import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy',
  '/terms',
  '/faq',
  '/onboarding',
  '/api/stripe/webhook',
  '/api/states', // Public endpoint for state rules
])

// Define API routes for rate limiting
const isApiRoute = createRouteMatcher(['/api/(.*)'])

// Check if Clerk is configured
const isClerkConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  )
}

// Development middleware without Clerk
function devMiddleware(req: NextRequest) {
  // Rate limit API routes
  if (isApiRoute(req)) {
    const { allowed, resetIn } = checkRateLimit(req)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }
  return NextResponse.next()
}

// Production middleware with Clerk
const clerkMiddlewareHandler = clerkMiddleware(async (auth, req) => {
  // Rate limit API routes
  if (isApiRoute(req)) {
    const { allowed, resetIn } = checkRateLimit(req)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(resetIn / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    return
  }

  // Protect all other routes - redirect to sign-in if not authenticated
  const { userId } = await auth()
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return Response.redirect(signInUrl)
  }
})

export default async function middleware(req: NextRequest) {
  // Use dev middleware if Clerk is not configured
  if (!isClerkConfigured()) {
    console.warn('[Middleware] Clerk not configured - running in dev mode')
    return devMiddleware(req)
  }
  try {
    return await clerkMiddlewareHandler(req, {} as never)
  } catch (error) {
    // Allow the request to continue if middleware fails
    // This prevents 500 errors on 404 pages
    console.error('[Middleware] Error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml|json)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
