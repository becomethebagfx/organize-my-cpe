import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Organize My CPE",
  description: "Privacy policy for Organize My CPE",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: December 29, 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information you provide directly to us, including your name, email address,
              and professional credentials when you create an account. We also collect CPE course
              information and certificates you upload to track your continuing education.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services,
              including tracking your CPE credits, generating compliance reports, and sending
              renewal reminders. We may also use your information to communicate with you about
              your account or our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. AI Processing</h2>
            <p className="text-gray-300 leading-relaxed">
              We use artificial intelligence to extract course information from uploaded certificates
              and documents. This processing is done securely and the extracted data is only used to
              populate your CPE records. We do not use your documents to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-300 leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use secure
              cloud storage for uploaded documents and maintain appropriate technical safeguards
              to protect your information from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell your personal information. We may share your information with
              third-party service providers who assist us in operating our platform (such as
              cloud hosting, authentication, and payment processing), subject to confidentiality
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You may access, update, or delete your account information at any time through
              your account settings. You can export all your CPE data and request complete
              deletion of your account and associated data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies for authentication and session management. We may use
              analytics cookies to understand how users interact with our platform and improve
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &ldquo;last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this privacy policy, please contact us at
              support@organizemycpe.com.
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
