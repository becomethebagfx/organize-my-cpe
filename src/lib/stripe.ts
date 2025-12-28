import Stripe from 'stripe'

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return _stripe
}

// Price IDs - these would be created in Stripe dashboard
export const PRICES = {
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
}

// Product configuration
export const PRODUCTS = {
  PRO: {
    name: 'Organize My CPE Pro',
    description: 'Unlimited uploads, all 50 states, full compliance tracking',
    priceYearly: 999, // $9.99 in cents
  },
}

/**
 * Create a checkout session for Pro subscription
 */
export async function createCheckoutSession(options: {
  customerId?: string
  customerEmail: string
  userId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const { customerId, customerEmail, userId, successUrl, cancelUrl } = options

  const stripe = getStripe()
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRICES.PRO_YEARLY,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  }

  if (customerId) {
    sessionConfig.customer = customerId
  } else {
    sessionConfig.customer_email = customerEmail
  }

  return stripe.checkout.sessions.create(sessionConfig)
}

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(options: {
  customerId: string
  returnUrl: string
}): Promise<Stripe.BillingPortal.Session> {
  const stripe = getStripe()
  return stripe.billingPortal.sessions.create({
    customer: options.customerId,
    return_url: options.returnUrl,
  })
}

/**
 * Get subscription details
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription | null> {
  try {
    const stripe = getStripe()
    return await stripe.subscriptions.retrieve(subscriptionId)
  } catch {
    return null
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const stripe = getStripe()
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(
  payload: Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

/**
 * Get Stripe client for direct use
 */
export { getStripe as stripe }
