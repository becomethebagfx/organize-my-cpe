import { NextRequest, NextResponse } from 'next/server'
import { createBillingPortalSession } from '@/lib/stripe'
import { getOrCreateUserProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const userProfile = await getOrCreateUserProfile()

    if (!userProfile.stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: 'No billing account found' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await createBillingPortalSession({
      customerId: userProfile.stripeCustomerId,
      returnUrl: `${origin}/settings`,
    })

    return NextResponse.json({
      success: true,
      data: { url: session.url },
    })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
