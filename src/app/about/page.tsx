import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Zap, Shield, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us - Organize My CPE",
  description: "Learn about Organize My CPE - the AI-powered CPE tracking software built for CPAs. Our mission is to simplify CPE compliance across all 51 US jurisdictions.",
}

export default function AboutPage() {
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
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Organize My CPE
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We built Organize My CPE to solve a problem every CPA faces: tracking continuing
            professional education credits across multiple states with different rules, cycles,
            and requirements. Our AI-powered platform makes CPE compliance simple.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To eliminate the stress and confusion of CPE tracking for accounting professionals.
            We believe CPAs should spend their time serving clients, not wrestling with
            spreadsheets and state board requirements. Our platform handles the complexity
            so you can focus on what matters.
          </p>
        </section>

        {/* Who We Serve */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Who We Serve</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">CPAs & Accountants</h3>
              <p className="text-gray-600 text-sm">
                Licensed professionals who need to maintain CPE credits for license renewal
                across one or multiple state jurisdictions.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">Multi-State Practitioners</h3>
              <p className="text-gray-600 text-sm">
                CPAs licensed in multiple states who face the challenge of tracking different
                requirements, cycles, and subject-specific mandates.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">Accounting Firms</h3>
              <p className="text-gray-600 text-sm">
                Firms that need to ensure their staff maintains proper CPE compliance
                and wants to streamline the tracking process.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">New CPAs</h3>
              <p className="text-gray-600 text-sm">
                Recently licensed professionals learning to navigate CPE requirements
                for the first time.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Your Certificates</h3>
                <p className="text-gray-600 text-sm">Upload PDF certificates from any CPE provider. Our AI automatically extracts course details, credit hours, and completion dates.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Select Your States</h3>
                <p className="text-gray-600 text-sm">Choose which states you&apos;re licensed in. We know the unique requirements for all 50 states plus DC - cycles, ethics hours, A&amp;A requirements, and more.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Track Your Progress</h3>
                <p className="text-gray-600 text-sm">View your compliance status at a glance. See exactly how many hours you need in each category for each state.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Generate Reports</h3>
                <p className="text-gray-600 text-sm">Export state-specific compliance reports ready for license renewal. No more manual compilation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Why Choose Organize My CPE</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600"><strong className="text-gray-900">51 Jurisdictions:</strong> We track requirements for all 50 states plus Washington DC</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600"><strong className="text-gray-900">AI-Powered:</strong> Upload certificates and let our AI extract the details automatically</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600"><strong className="text-gray-900">Simple Pricing:</strong> Just $9.99/year - less than the cost of one CPE credit</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600"><strong className="text-gray-900">State-Specific Reports:</strong> Generate compliance reports formatted for each state board</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600"><strong className="text-gray-900">Always Current:</strong> We keep up with changing state requirements so you don&apos;t have to</span>
            </li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Your Data is Secure</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We take data security seriously. All data is encrypted in transit and at rest.
            Your CPE records and certificates are stored securely and only accessible by you.
            We never share or sell your information.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Simplify Your CPE Tracking?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of CPAs who have stopped worrying about CPE compliance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg">Get Started Free</Button>
            </Link>
            <Link href="/faq">
              <Button variant="outline" size="lg">Read FAQ</Button>
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
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
