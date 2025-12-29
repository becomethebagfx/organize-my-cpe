import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Common questions about Organize My CPE - CPE tracking software for CPAs. Learn about features, pricing, state requirements, and AI extraction.",
}

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is Organize My CPE?",
        answer: "Organize My CPE is an AI-powered CPE tracking software designed for CPAs and accountants. It automatically extracts course details from PDF certificates, tracks your compliance across all 51 US jurisdictions, and generates state-specific reports for license renewal."
      },
      {
        question: "Who is this for?",
        answer: "Organize My CPE is designed for CPAs, accountants, and accounting professionals who need to track continuing professional education (CPE) credits for license renewal. It's especially useful for those licensed in multiple states."
      },
      {
        question: "How is this different from spreadsheets?",
        answer: "Unlike spreadsheets, Organize My CPE automatically extracts course data from your PDF certificates using AI, knows the specific CPE requirements for all 51 jurisdictions, and generates state-specific compliance reports. No more manual data entry or researching state rules."
      }
    ]
  },
  {
    category: "CPE Requirements",
    questions: [
      {
        question: "How many CPE credits do I need?",
        answer: "CPE requirements vary by state. Most states require 40 hours per year or 80 hours every two years, with specific ethics requirements. Some states like Texas require 120 hours every 3 years. Organize My CPE tracks the unique requirements for all 51 jurisdictions including ethics, A&A, and technical hours."
      },
      {
        question: "Which states does Organize My CPE support?",
        answer: "Organize My CPE supports all 50 US states plus Washington DC (51 jurisdictions total). Each state has unique CPE requirements, cycle types (annual, biennial, triennial, rolling), and subject requirements that we track automatically."
      },
      {
        question: "What are the different CPE cycle types?",
        answer: "States use different CPE cycle types: Annual (every calendar year), Biennial (every 2 years, odd or even), Triennial (every 3 years), and Rolling (continuous 2-year or 3-year periods). We automatically track your progress based on each state's specific cycle type."
      }
    ]
  },
  {
    category: "AI Extraction",
    questions: [
      {
        question: "How does the AI extraction work?",
        answer: "Simply upload your PDF certificate, and our AI automatically extracts the course name, credit hours, completion date, field of study, and provider. The extracted data is automatically added to your CPE tracker with over 95% accuracy."
      },
      {
        question: "What file formats are supported?",
        answer: "We support PDF certificates (most common), as well as CSV and XLSX spreadsheets for bulk imports. You can also upload ZIP files containing multiple PDFs for batch processing."
      },
      {
        question: "What if the AI extraction is incorrect?",
        answer: "You can easily edit any extracted data before saving. All fields are editable, and you can manually add courses that don't have a PDF certificate."
      }
    ]
  },
  {
    category: "Pricing & Billing",
    questions: [
      {
        question: "How much does Organize My CPE cost?",
        answer: "Organize My CPE offers a free tier with up to 5 document uploads and 1 state export. The Pro plan is just $9.99/year and includes unlimited uploads, all 51 state exports, and priority support - less than the cost of a single CPE course."
      },
      {
        question: "Is there a free trial?",
        answer: "Yes! The free tier lets you upload up to 5 PDF certificates and export compliance reports for 1 state. No credit card required to start."
      },
      {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your Pro subscription at any time. You'll retain access until the end of your billing period. Your data is never deleted unless you request it."
      }
    ]
  },
  {
    category: "Data & Security",
    questions: [
      {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard encryption for all data in transit and at rest. Your certificates and course data are stored securely and never shared with third parties."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can export your complete course history and compliance reports in CSV or XLSX format at any time. We believe in data portability."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account and all associated data at any time from the Settings page. This action is permanent and cannot be undone."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <Button asChild>
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about tracking your CPE credits with Organize My CPE
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((category) => (
            <section key={category.category}>
              <h2 className="text-2xl font-bold mb-6 text-primary">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-lg border p-4 cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-medium list-none">
                      {faq.question}
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center bg-primary/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Start tracking your CPE for free and see for yourself.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:support@organizemycpe.com">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Organize My CPE. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
