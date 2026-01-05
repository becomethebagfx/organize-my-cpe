import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Organize My CPE",
  description: "Privacy policy for Organize My CPE. Learn how we protect your CPE tracking data, certificates, and personal information with industry-standard encryption.",
  alternates: {
    canonical: "https://organizemycpe.com/privacy",
  },
};

export default function PrivacyPage() {
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
            <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/sign-in" className="btn-brand">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: December 29, 2025</p>

        <div className="prose-brand space-y-8">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including your name, email address,
              and professional credentials when you create an account. We also collect CPE course
              information and certificates you upload to track your continuing education.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services,
              including tracking your CPE credits, generating compliance reports, and sending
              renewal reminders. We may also use your information to communicate with you about
              your account or our services.
            </p>
          </section>

          <section>
            <h2>3. AI Processing</h2>
            <p>
              We use artificial intelligence to extract course information from uploaded certificates
              and documents. This processing is done securely and the extracted data is only used to
              populate your CPE records. We do not use your documents to train AI models.
            </p>
          </section>

          <section>
            <h2>4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use secure
              cloud storage for uploaded documents and maintain appropriate technical safeguards
              to protect your information from unauthorized access.
            </p>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with
              third-party service providers who assist us in operating our platform (such as
              cloud hosting, authentication, and payment processing), subject to confidentiality
              obligations.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>
              You may access, update, or delete your account information at any time through
              your account settings. You can export all your CPE data and request complete
              deletion of your account and associated data.
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We may use
              analytics cookies to understand how users interact with our platform and improve
              our services.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &ldquo;last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
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
