import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, MessageSquare, Clock, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - CPE Tracking Support | Organize My CPE",
  description: "Get help with Organize My CPE. Contact our support team for questions about CPE tracking, state compliance, AI extraction, or billing. We typically respond within 24 hours.",
  alternates: {
    canonical: "https://organizemycpe.com/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">Organize My CPE</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have a question about CPE tracking or need help with your account?
            We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </section>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Email Support */}
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Email Support</h2>
                <p className="text-sm text-muted-foreground">Best for detailed questions</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Send us an email and we&apos;ll respond within 24 hours during business days.
            </p>
            <a
              href="mailto:support@organizemycpe.com"
              className="inline-flex items-center text-brand-primary hover:text-brand-primary-light font-medium"
            >
              support@organizemycpe.com
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-brand-success/10 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-brand-success" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">FAQ</h2>
                <p className="text-sm text-muted-foreground">Instant answers</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Find answers to common questions about CPE tracking, state requirements, and billing.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center text-brand-primary hover:text-brand-primary-light font-medium"
            >
              View FAQ
            </Link>
          </div>
        </div>

        {/* Response Time */}
        <section className="bg-brand-primary/5 rounded-xl p-8 mb-16">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Response Time</h2>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within 24 hours during business days
                (Monday - Friday, 9 AM - 5 PM EST). Pro subscribers receive priority support
                with faster response times.
              </p>
            </div>
          </div>
        </section>

        {/* Common Topics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Common Support Topics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Account & Billing</h3>
              <p className="text-sm text-muted-foreground">
                Questions about subscriptions, payments, or account settings.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">CPE Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Help with uploading certificates, tracking hours, or compliance questions.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">AI Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Issues with automatic data extraction from PDF certificates.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">State Requirements</h3>
              <p className="text-sm text-muted-foreground">
                Questions about specific state CPE rules and compliance cycles.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-foreground rounded-xl p-8 text-center text-background">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-brand-accent" />
          <h2 className="text-2xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            Join thousands of CPAs who have simplified their CPE tracking.
            Start for free today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="bg-background text-foreground hover:bg-muted">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-background text-background hover:bg-background/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Organize My CPE. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
