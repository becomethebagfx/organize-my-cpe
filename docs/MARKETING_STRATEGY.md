# Marketing Strategy - Organize My CPE

## Target Audience

### Primary Personas

1. **Solo CPA** (40% of market)
   - Self-employed or small practice
   - Manages own compliance
   - Price-sensitive
   - Values simplicity

2. **Multi-State CPA** (25%)
   - Licensed in 3+ states
   - Complex tracking needs
   - Willing to pay for automation
   - Time-sensitive

3. **Industry CPA** (20%)
   - CFO, Controller, or senior accountant
   - Needs personal CPE tracking
   - Not primary job function
   - Wants "set and forget"

4. **Small Firm Partner** (15%)
   - Managing 2-10 CPAs
   - Needs team visibility
   - Compliance oversight responsibility

## SEO Strategy

### Target Keywords

**High-Intent (Conversion Focus)**
| Keyword | Monthly Volume | Difficulty | Intent |
|---------|---------------|------------|--------|
| CPE tracker for CPAs | 500 | Medium | Transactional |
| CPE compliance software | 300 | Medium | Transactional |
| track CPE credits online | 400 | Low | Transactional |
| CPE certificate organizer | 200 | Low | Transactional |

**Informational (Traffic + Authority)**
| Keyword | Monthly Volume | Difficulty | Intent |
|---------|---------------|------------|--------|
| CPE requirements by state | 2,400 | Medium | Informational |
| how many CPE hours do CPAs need | 1,800 | Low | Informational |
| CPA license renewal requirements | 1,200 | Medium | Informational |
| CPE ethics requirements | 800 | Low | Informational |

### Content Strategy

**Pillar Pages (Long-Form, 3000+ words)**
1. `/guides/cpe-requirements-all-50-states` - Comprehensive state-by-state guide
2. `/guides/cpe-tracking-best-practices` - Ultimate guide to tracking
3. `/guides/multi-state-cpa-compliance` - Multi-state licensing guide

**Supporting Content (Blog Posts)**
1. State-specific articles (50x): "California CPA CPE Requirements 2025"
2. Topic guides: "Understanding Ethics CPE Requirements"
3. Comparison posts: "CPE Tracker vs Manual Spreadsheet"
4. How-to guides: "How to Organize Your CPE Certificates"

### Technical SEO

**On-Page Optimization**
- Semantic HTML structure (h1, h2, h3 hierarchy)
- Meta descriptions with CTAs
- Schema.org markup (SoftwareApplication, FAQPage)
- Internal linking between state pages

**Page Speed Targets**
- Core Web Vitals: All green
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Next.js Image optimization
- CDN for static assets

**Sitemap Structure**
```
/
├── /dashboard (authenticated)
├── /upload (authenticated)
├── /courses (authenticated)
├── /exports (authenticated)
├── /settings (authenticated)
├── /guides/
│   ├── /cpe-requirements-all-50-states
│   ├── /cpe-tracking-best-practices
│   └── /multi-state-cpa-compliance
├── /states/
│   ├── /alabama-cpe-requirements
│   ├── /alaska-cpe-requirements
│   └── ... (50 state pages)
└── /blog/
    ├── /ethics-cpe-explained
    └── ... (ongoing content)
```

## AEO (Answer Engine Optimization) Strategy

### AI Search Optimization

**Target AI Assistants**
- ChatGPT (OpenAI)
- Claude (Anthropic)
- Google Bard/Gemini
- Bing Copilot
- Perplexity

**Structured Data Implementation**
```json
{
  "@type": "SoftwareApplication",
  "name": "Organize My CPE",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD",
    "billingPeriod": "year"
  }
}
```

**FAQ Schema** (for each state page)
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many CPE hours do California CPAs need?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "California CPAs need 80 hours every 2 years..."
      }
    }
  ]
}
```

### Content Format for AI

**Optimized Answer Blocks**
- Direct answers in first paragraph
- Bullet points for lists
- Tables for comparative data
- Clear numerical values
- Source citations

**Example Optimized Content:**
> **California CPA CPE Requirements (2025)**
>
> California CPAs must complete **80 CPE hours every 2 years** (biennial cycle, even years). Requirements include:
> - **4 hours** of ethics
> - **4 hours** of regulatory review
> - Minimum of 20 hours per year
>
> Source: California Board of Accountancy

## Launch Strategy

### Phase 1: Foundation (Week 1-2)
- [ ] Deploy production site
- [ ] Set up Google Search Console
- [ ] Submit sitemap
- [ ] Configure analytics (GA4, Plausible)
- [ ] Create 10 pillar state pages

### Phase 2: Content (Week 3-6)
- [ ] Publish all 50 state CPE pages
- [ ] Create 3 pillar guides
- [ ] Set up email capture
- [ ] Launch basic blog

### Phase 3: Distribution (Week 7-12)
- [ ] Reddit engagement (r/accounting, r/CPA)
- [ ] LinkedIn content for CPAs
- [ ] Guest posts on accounting blogs
- [ ] YouTube tutorial videos
- [ ] Podcast appearances

### Phase 4: Paid (Month 3+)
- [ ] Google Ads for high-intent keywords
- [ ] LinkedIn Sponsored Content
- [ ] Retargeting campaigns
- [ ] Affiliate partnerships

## Conversion Optimization

### Landing Page Elements
1. Clear value proposition headline
2. State dropdown for immediate relevance
3. Comparison table (us vs. manual tracking)
4. Social proof (testimonials, user count)
5. Free trial or freemium tier

### Email Capture Strategy
- Free state-specific CPE requirement PDF
- Annual CPE deadline reminder signup
- Compliance checklist download

## Metrics & Goals

### Year 1 Targets
| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Organic Traffic | 500 | 2,000 | 5,000 | 10,000 |
| Signups | 100 | 500 | 1,500 | 3,000 |
| Paid Subscribers | 50 | 300 | 1,000 | 2,000 |
| MRR | $42 | $250 | $833 | $1,666 |

### Key Conversion Rates
- Landing page → Signup: 5%
- Signup → Paid: 30%
- Churn rate target: < 5% annually

## Budget Allocation (Year 1)

| Category | Budget | Notes |
|----------|--------|-------|
| Content Creation | $2,000 | Writer for state pages |
| SEO Tools | $500 | Ahrefs/Semrush |
| Paid Ads (Q3-4) | $1,500 | Google/LinkedIn |
| Design | $500 | Graphics, social assets |
| **Total** | **$4,500** | |

## Competitive Positioning

### Messaging Framework

**Primary Message:**
"The only CPE tracker built for CPAs who earn credits anywhere, not just from one provider."

**Supporting Messages:**
1. "AI-powered certificate extraction - just upload, we do the rest"
2. "Track all 50 states in one dashboard"
3. "Half the price of Becker, twice the flexibility"
4. "Stop juggling spreadsheets and folders"

### Differentiation Table

| Feature | Us | Becker | NASBA | MYCPE |
|---------|-----|--------|-------|-------|
| Any Provider | Yes | No | Manual | No |
| AI Extraction | Yes | No | No | No |
| Price | $9.99/yr | $19.99/yr | Free | $$$ |
| 50-State Rules | Yes | Yes | Limited | Yes |
| Export Formats | All | Limited | Basic | Limited |
