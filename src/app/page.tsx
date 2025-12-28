import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, BarChart3, Download, CheckCircle, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Organize My CPE</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Organize Your CPE Credits
          <br />
          <span className="text-primary">In Minutes, Not Hours</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Stop wrestling with spreadsheets. Upload your certificates, we&apos;ll extract the
          data, track your compliance, and generate state-specific reports automatically.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8">
              Start Free
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">
              See How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold mb-12">
          Three Simple Steps to CPE Compliance
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>1. Upload</CardTitle>
              <CardDescription>
                Drop your certificates, spreadsheets, or ZIP files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We accept PDFs, CSV, XLSX, and ZIP archives. Upload as many files as you need.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>2. Review</CardTitle>
              <CardDescription>
                We extract and organize your course data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered extraction identifies courses, dates, credits, and categories.
                Just verify and correct if needed.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>3. Export</CardTitle>
              <CardDescription>
                Download state-specific reports instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get formatted exports for each state board, ready for submission or your
                records.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-12">
            Built for Multi-State CPAs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">All 50 States</h3>
                <p className="text-sm text-muted-foreground">
                  Requirements for every state board, kept up to date
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Smart Extraction</h3>
                <p className="text-sm text-muted-foreground">
                  AI reads your certificates and extracts key data
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Compliance Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly what&apos;s complete and what&apos;s missing
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">State Formats</h3>
                <p className="text-sm text-muted-foreground">
                  Exports match each state&apos;s required template
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Duplicate Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically finds and merges duplicate entries
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Certificate Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all your certificates organized in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold mb-4">
          Simple, Affordable Pricing
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Less than a single CPE course
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Try it out</CardDescription>
              <div className="text-3xl font-bold mt-4">$0</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Up to 10 document uploads
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  1 state export
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Basic compliance dashboard
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  30-day data retention
                </li>
              </ul>
              <Link href="/sign-up" className="block mt-6">
                <Button variant="outline" className="w-full">
                  Start Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Full access</CardDescription>
              <div className="text-3xl font-bold mt-4">
                $9.99<span className="text-base font-normal">/year</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Unlimited document uploads
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  All 50 state exports
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Full compliance dashboard
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Unlimited data retention
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Priority support
                </li>
              </ul>
              <Link href="/sign-up" className="block mt-6">
                <Button className="w-full">Get Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-center text-3xl font-bold mb-4">
          Why Choose Organize My CPE?
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Compare us to the alternatives
        </p>
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Feature</th>
                <th className="text-center py-3 px-4 bg-primary/5 font-bold">Organize My CPE</th>
                <th className="text-center py-3 px-4">Spreadsheets</th>
                <th className="text-center py-3 px-4">Other Trackers</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Price</td>
                <td className="text-center py-3 px-4 bg-primary/5 font-semibold text-green-600">$9.99/year</td>
                <td className="text-center py-3 px-4">Free</td>
                <td className="text-center py-3 px-4">$19.99+/year</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">AI Certificate Extraction</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
                <td className="text-center py-3 px-4 text-muted-foreground">Manual entry</td>
                <td className="text-center py-3 px-4 text-muted-foreground">Limited</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Works with Any Provider</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
                <td className="text-center py-3 px-4 text-muted-foreground">Their courses only</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">50-State Compliance Rules</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
                <td className="text-center py-3 px-4 text-muted-foreground">DIY research</td>
                <td className="text-center py-3 px-4">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">State-Specific Exports</td>
                <td className="text-center py-3 px-4 bg-primary/5">
                  <CheckCircle className="h-5 w-5 text-green-600 inline" />
                </td>
                <td className="text-center py-3 px-4 text-muted-foreground">Manual formatting</td>
                <td className="text-center py-3 px-4">Limited formats</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Your Data, Your Control</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Organize My CPE</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Organize My CPE. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
