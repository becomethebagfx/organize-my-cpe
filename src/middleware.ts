import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/stripe/webhook',
])

// Define API routes for rate limiting
const isApiRoute = createRouteMatcher(['/api/(.*)'])

export default clerkMiddleware(async (auth, req) => {
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

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
