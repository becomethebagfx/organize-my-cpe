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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Organize My CPE</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have a question about CPE tracking or need help with your account?
            We&apos;re here to help. Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </section>

        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Email Support */}
          <div className="bg-white rounded-xl border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Email Support</h2>
                <p className="text-sm text-gray-500">Best for detailed questions</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Send us an email and we&apos;ll respond within 24 hours during business days.
            </p>
            <a
              href="mailto:support@organizemycpe.com"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              support@organizemycpe.com
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl border p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">FAQ</h2>
                <p className="text-sm text-gray-500">Instant answers</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Find answers to common questions about CPE tracking, state requirements, and billing.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View FAQ
            </Link>
          </div>
        </div>

        {/* Response Time */}
        <section className="bg-blue-50 rounded-xl p-8 mb-16">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Response Time</h2>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days
                (Monday - Friday, 9 AM - 5 PM EST). Pro subscribers receive priority support
                with faster response times.
              </p>
            </div>
          </div>
        </section>

        {/* Common Topics */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Support Topics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Account & Billing</h3>
              <p className="text-sm text-gray-600">
                Questions about subscriptions, payments, or account settings.
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">CPE Tracking</h3>
              <p className="text-sm text-gray-600">
                Help with uploading certificates, tracking hours, or compliance questions.
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">AI Extraction</h3>
              <p className="text-sm text-gray-600">
                Issues with automatic data extraction from PDF certificates.
              </p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-2">State Requirements</h3>
              <p className="text-sm text-gray-600">
                Questions about specific state CPE rules and compliance cycles.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 rounded-xl p-8 text-center text-white">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Join thousands of CPAs who have simplified their CPE tracking.
            Start for free today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Organize My CPE. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
