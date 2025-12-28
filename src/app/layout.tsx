import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Organize My CPE - CPA Continuing Education Tracker",
  description:
    "Track, organize, and export your CPE credits for all 50 states. Upload certificates, auto-extract course data, and generate state-specific reports.",
  keywords: [
    "CPE tracking",
    "CPA continuing education",
    "CPE compliance",
    "accountant CPE",
    "state board CPE",
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
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
