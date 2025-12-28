import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { constructWebhookEvent, stripe as getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    )
  }

  let event

  try {
    event = constructWebhookEvent(Buffer.from(body), signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Fetch the subscription to confirm it's active
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId)

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await db.userProfile.update({
      where: { id: userId },
      data: {
        tier: 'PAID',
        stripeCustomerId: customerId,
      },
    })
    console.log(`User ${userId} upgraded to PAID tier`)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    // Try to find user by subscription lookup
    console.log('No userId in subscription metadata, skipping update')
    return
  }

  const isActive =
    subscription.status === 'active' || subscription.status === 'trialing'

  await db.userProfile.update({
    where: { id: userId },
    data: {
      tier: isActive ? 'PAID' : 'FREE',
    },
  })

  console.log(
    `User ${userId} subscription updated: ${subscription.status} -> ${isActive ? 'PAID' : 'FREE'}`
  )
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    console.log('No userId in subscription metadata, skipping deletion handling')
    return
  }

  await db.userProfile.update({
    where: { id: userId },
    data: {
      tier: 'FREE',
    },
  })

  console.log(`User ${userId} subscription deleted, downgraded to FREE tier`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  // Find user by Stripe customer ID
  const user = await db.userProfile.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (user) {
    console.log(`Payment failed for user ${user.id}`)
    // Could send notification email here
  }
}
