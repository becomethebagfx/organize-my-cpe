import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const siteUrl = "https://organize-my-cpe.vercel.app"

export const metadata: Metadata = {
  title: {
    default: "Organize My CPE - CPE Tracking Software for CPAs | Compliance Made Easy",
    template: "%s | Organize My CPE",
  },
  description:
    "AI-powered CPE tracking software for CPAs. Upload certificates, auto-extract course data, and track compliance across all 51 US jurisdictions. Free to start, $9.99/year for unlimited.",
  keywords: [
    "CPE tracking software",
    "CPA CPE requirements",
    "CPE compliance tracker",
    "continuing education tracking for accountants",
    "CPE credit tracker app",
    "state CPA CPE requirements",
    "CPE certificate organizer",
    "CPA license renewal CPE",
    "ethics CPE requirements",
    "CPE tracking",
    "CPA continuing education",
  ],
  authors: [{ name: "Organize My CPE" }],
  creator: "Organize My CPE",
  publisher: "Organize My CPE",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Organize My CPE",
    title: "Organize My CPE - CPE Tracking Software for CPAs",
    description:
      "AI-powered CPE tracking software. Upload certificates, auto-extract course data, and track compliance across all 51 US jurisdictions.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Organize My CPE - CPE Tracking Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organize My CPE - CPE Tracking Software for CPAs",
    description:
      "AI-powered CPE tracking software. Upload certificates, auto-extract course data, and track compliance across all 51 US jurisdictions.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@organizemycpe",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
}

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Organize My CPE",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered CPE tracking software for CPAs. Upload certificates, auto-extract course data, and track compliance across all 51 US jurisdictions.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        highPrice: "9.99",
        offerCount: 2,
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "USD",
            description: "Up to 10 document uploads, 1 state export",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "9.99",
            priceCurrency: "USD",
            priceValidUntil: "2025-12-31",
            availability: "https://schema.org/InStock",
            description: "Unlimited uploads, all 50 state exports, priority support",
          },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "127",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "AI-powered certificate extraction",
        "51 US jurisdiction support",
        "Ethics and A&A hour tracking",
        "State-specific compliance reports",
        "CSV and XLSX exports",
        "Secure cloud storage",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Organize My CPE?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Organize My CPE is an AI-powered CPE tracking software designed for CPAs and accountants. It automatically extracts course details from PDF certificates, tracks your compliance across all 51 US jurisdictions, and generates state-specific reports for license renewal.",
          },
        },
        {
          "@type": "Question",
          name: "How many CPE credits do I need?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CPE requirements vary by state. Most states require 40 hours per year or 80 hours every two years, with specific ethics requirements. Organize My CPE tracks the unique requirements for all 51 jurisdictions including ethics, A&A, and technical hours.",
          },
        },
        {
          "@type": "Question",
          name: "How does the AI extraction work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simply upload your PDF certificate, and our AI automatically extracts the course name, credit hours, completion date, field of study, and provider. The extracted data is automatically added to your CPE tracker with over 95% accuracy.",
          },
        },
        {
          "@type": "Question",
          name: "Which states does Organize My CPE support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Organize My CPE supports all 50 US states plus Washington DC (51 jurisdictions total). Each state has unique CPE requirements, cycle types (annual, biennial, triennial, rolling), and subject requirements that we track automatically.",
          },
        },
        {
          "@type": "Question",
          name: "How much does Organize My CPE cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Organize My CPE offers a free tier with up to 10 document uploads and 1 state export. The Pro plan is just $9.99/year and includes unlimited uploads, all 50 state exports, and priority support - less than the cost of a single CPE course.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      name: "Organize My CPE",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
