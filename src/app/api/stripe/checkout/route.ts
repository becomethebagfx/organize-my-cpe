import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getOrCreateUserProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const userProfile = await getOrCreateUserProfile()

    // Check if already on paid tier
    if (userProfile.tier === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Already on Pro plan' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await createCheckoutSession({
      customerId: userProfile.stripeCustomerId || undefined,
      customerEmail: userProfile.email,
      userId: userProfile.id,
      successUrl: `${origin}/settings?success=true`,
      cancelUrl: `${origin}/settings?canceled=true`,
    })

    return NextResponse.json({
      success: true,
      data: { url: session.url },
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
