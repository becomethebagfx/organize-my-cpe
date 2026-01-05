# Upgrade/Stripe Flow Audit Report

**Date:** 2026-01-05
**Auditor:** Claude Code

---

## Summary

| Item | Status | Notes |
|------|--------|-------|
| Stripe Keys | Configured | `STRIPE_SECRET_KEY`, `STRIPE_PRO_YEARLY_PRICE_ID` |
| Checkout Session | Implemented | `/api/stripe/checkout` route |
| Webhook Handler | Implemented | `/api/stripe/webhook` route |
| Billing Portal | Implemented | `/api/stripe/portal` route |
| Frontend Button | Wired | `handleUpgrade()` in settings/page.tsx |
| Loading State | **MISSING** | Button has no loading indicator |
| Error Feedback | **MISSING** | Errors silently logged to console |

---

## Code Analysis

### `/src/app/api/stripe/checkout/route.ts`
**Status:** Working correctly

- Creates Stripe checkout session with proper metadata
- Handles already-paid users (returns 400)
- Returns session URL for redirect
- Proper success/cancel URLs

### `/src/lib/stripe.ts`
**Status:** Working correctly

- Lazy-loads Stripe client
- Uses correct API version
- Implements checkout, portal, subscription management
- Webhook signature verification present

### `/src/app/(dashboard)/settings/page.tsx`
**Status:** NEEDS FIXES

**Lines 95-108 (handleUpgrade):**
```typescript
const handleUpgrade = async () => {
  try {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    if (data.success && data.data?.url) {
      window.location.href = data.data.url
    }
    // BUG: No error handling for !response.ok
    // BUG: No error handling for !data.success
    // BUG: No loading state on button
  } catch (error) {
    console.error("Failed to start checkout:", error)
    // BUG: User sees nothing
  }
}
```

**Issues:**
1. No loading state during API call
2. Errors silently caught - user sees nothing
3. Non-success responses ignored
4. Button shows "Upgrade to Pro" without any feedback

---

## Required Fixes

### Fix 1: Add loading state
```typescript
const [upgrading, setUpgrading] = useState(false)
```

### Fix 2: Add error toast
```typescript
import { toast } from "@/components/ui/toast" // or similar
```

### Fix 3: Improve handleUpgrade
```typescript
const handleUpgrade = async () => {
  setUpgrading(true)
  try {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to create checkout session")
    }

    if (data.data?.url) {
      window.location.href = data.data.url
    } else {
      throw new Error("No checkout URL returned")
    }
  } catch (error) {
    console.error("Checkout failed:", error)
    toast.error(error.message || "Failed to start upgrade. Please try again.")
  } finally {
    setUpgrading(false)
  }
}
```

---

## Production Checklist

- [ ] Set `STRIPE_SECRET_KEY` to live key (starts with `sk_live_`)
- [ ] Set `STRIPE_WEBHOOK_SECRET` to live webhook secret
- [ ] Create live price in Stripe dashboard
- [ ] Set `STRIPE_PRO_YEARLY_PRICE_ID` to live price ID
- [ ] Configure webhook endpoint: `https://organizemycpe.com/api/stripe/webhook`
- [ ] Test checkout flow end-to-end
- [ ] Verify subscription status updates after payment
