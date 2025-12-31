# Google Setup Instructions for Organize My CPE

## Domain
- **Production URL:** https://organizemycpe.com
- **Vercel URL:** https://organize-my-cpe.vercel.app

## Google Search Console Setup

1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Select "URL prefix" method
4. Enter: `https://organizemycpe.com`
5. Verify using HTML tag method
6. Copy the meta tag content value
7. Submit sitemap: `https://organizemycpe.com/sitemap.xml`

### Verification Meta Tag Location
Add to `src/app/layout.tsx` in the `<head>` section:
```tsx
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

## Google Analytics (GA4) Setup

1. Go to https://analytics.google.com
2. Click "Admin" (gear icon)
3. Click "Create Property"
4. Property name: `Organize My CPE`
5. Select your timezone and currency
6. Business details: Online business, Small
7. Choose "Web" platform
8. Website URL: `https://organizemycpe.com`
9. Stream name: `OMC Production`
10. Copy the Measurement ID (G-XXXXXXXXXX)

### Add Measurement ID to Vercel
```bash
# Add to Vercel environment variables
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Playwright Automation

Run from this directory:
```bash
node scripts/google-setup.mjs
```

Credentials (for Playwright):
- Email: brandonhayman.b@gmail.com
- Password: pijxub-Dostif-0ruqzu

## Sitemap Location
- File: `/public/sitemap.xml`
- URL: https://organizemycpe.com/sitemap.xml
