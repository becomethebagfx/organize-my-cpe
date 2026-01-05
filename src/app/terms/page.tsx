import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Organize My CPE",
  description: "Terms of service for Organize My CPE. Review our subscription terms, user responsibilities, and data handling policies for CPE tracking services.",
  alternates: {
    canonical: "https://organizemycpe.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="page-container">
      {/* Consistent Header */}
      <header className="site-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-6 w-6 rounded bg-[hsl(var(--brand-primary))]"></div>
            <span>OrganizeMyCPE</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/pricing" className="hidden sm:inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/sign-in" className="btn-brand text-sm">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: December 29, 2025</p>

        <div className="prose-brand space-y-8">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Organize My CPE, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Organize My CPE is a software platform designed to help accounting professionals
              track and manage their Continuing Professional Education (CPE) credits. The service
              includes document upload, AI-powered data extraction, compliance tracking, and
              reporting features.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              You must create an account to use our service. You are responsible for maintaining
              the confidentiality of your account credentials and for all activities that occur
              under your account. You must provide accurate and complete information when creating
              your account.
            </p>
          </section>

          <section>
            <h2>4. Subscription and Payment</h2>
            <p>
              Organize My CPE is offered as a subscription service. By subscribing, you agree to
              pay the applicable subscription fees. Subscriptions automatically renew unless
              cancelled before the renewal date. Refunds are provided according to our refund policy.
            </p>
          </section>

          <section>
            <h2>5. User Responsibilities</h2>
            <p>
              You are solely responsible for the accuracy of the CPE information you enter or
              upload. While we use AI to assist with data extraction, you should verify all
              extracted information. Our service is a tracking tool and does not replace your
              obligation to maintain accurate records for your licensing board.
            </p>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <p>
              The Organize My CPE service, including its design, features, and content, is
              protected by intellectual property laws. You may not copy, modify, or distribute
              any part of our service without permission.
            </p>
          </section>

          <section>
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              Our service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
              that our AI extraction will be 100% accurate, and you should always verify
              extracted data. We are not responsible for any issues arising from inaccurate
              CPE tracking or compliance failures.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Organize My CPE shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your use
              of the service, including but not limited to loss of license, professional
              penalties, or compliance issues.
            </p>
          </section>

          <section>
            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these terms.
              You may cancel your subscription at any time through your account settings. Upon
              termination, you may export your data before your account is deleted.
            </p>
          </section>

          <section>
            <h2>10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:support@organizemycpe.com">support@organizemycpe.com</a>.
            </p>
          </section>
        </div>
      </main>

      {/* Consistent Footer */}
      <footer className="border-t border-border bg-white py-8 px-6 mt-16">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">OrganizeMyCPE</span>
            <p className="text-sm text-muted-foreground mt-1">&copy; 2025 Organize My CPE. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
