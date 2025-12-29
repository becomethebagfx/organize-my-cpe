"use client";

import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-6 w-6 rounded bg-black"></div>
            <span>OrganizeMyCPE</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Less than a single CPE course. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="text-sm text-gray-500 mt-1">Get started for free</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 ml-1">/forever</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Up to 10 document uploads</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>1 state compliance tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Basic compliance dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>AI certificate extraction</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block mt-8 w-full py-3 px-4 text-center rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl border-2 border-black bg-white p-8 shadow-sm relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="text-sm text-gray-500 mt-1">Full access, all features</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-500 ml-1">/year</span>
              </div>
              <ul className="mt-8 space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span><strong>Unlimited</strong> document uploads</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span><strong>All 50 states</strong> + DC compliance</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Full compliance dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>AI certificate extraction</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Export to CSV, XLSX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>State-specific audit reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block mt-8 w-full py-3 px-4 text-center rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Get Pro
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">What payment methods do you accept?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">Do you offer refunds?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Yes, we offer a 30-day money-back guarantee. If you&apos;re not satisfied, contact us for a full refund.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900">Is my data secure?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Absolutely. We use bank-level AES-256 encryption for all documents. Your certificates are stored securely and never shared.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to simplify your CPE tracking?
            </h2>
            <p className="text-gray-500 mb-8">
              Join thousands of CPAs who trust OrganizeMyCPE.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">OrganizeMyCPE</span>
            <p className="text-sm text-gray-500 mt-1">&copy; 2025 Organize My CPE. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <Link href="/faq" className="hover:text-black">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
