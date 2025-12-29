import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Organize My CPE",
  description: "Terms of service for Organize My CPE",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-white/10 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-xl font-bold">
            Organize My CPE
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: December 29, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using Organize My CPE, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              Organize My CPE is a software platform designed to help accounting professionals
              track and manage their Continuing Professional Education (CPE) credits. The service
              includes document upload, AI-powered data extraction, compliance tracking, and
              reporting features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed">
              You must create an account to use our service. You are responsible for maintaining
              the confidentiality of your account credentials and for all activities that occur
              under your account. You must provide accurate and complete information when creating
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
            <p className="text-gray-300 leading-relaxed">
              Organize My CPE is offered as a subscription service. By subscribing, you agree to
              pay the applicable subscription fees. Subscriptions automatically renew unless
              cancelled before the renewal date. Refunds are provided according to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">
              You are solely responsible for the accuracy of the CPE information you enter or
              upload. While we use AI to assist with data extraction, you should verify all
              extracted information. Our service is a tracking tool and does not replace your
              obligation to maintain accurate records for your licensing board.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The Organize My CPE service, including its design, features, and content, is
              protected by intellectual property laws. You may not copy, modify, or distribute
              any part of our service without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-gray-300 leading-relaxed">
              Our service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
              that our AI extraction will be 100% accurate, and you should always verify
              extracted data. We are not responsible for any issues arising from inaccurate
              CPE tracking or compliance failures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, Organize My CPE shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your use
              of the service, including but not limited to loss of license, professional
              penalties, or compliance issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account at any time for violation of these terms.
              You may cancel your subscription at any time through your account settings. Upon
              termination, you may export your data before your account is deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these terms, contact us at support@organizemycpe.com.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
