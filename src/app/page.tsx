"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Globe,
  Zap,
  ChevronRight
} from 'lucide-react';

// Dub.co style minimalist button
const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  [key: string]: unknown;
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 hover:ring-gray-900 border border-transparent shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    text: "text-gray-600 hover:text-black bg-transparent"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Bento Grid Card
const BentoCard = ({
  title,
  description,
  icon: Icon,
  children,
  className = ""
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={`group relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 mb-4">
      <Icon className="h-5 w-5 text-gray-900" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
    {children && <div className="mt-6">{children}</div>}
  </div>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-gray-900 selection:text-white">

      {/* Navbar - Sticky & blurred like Dub */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="h-6 w-6 rounded bg-black"></div>
              <span>OrganizeMyCPE</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
              <a href="#features" className="hover:text-black transition-colors">Features</a>
              <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="text" className="hidden sm:flex">Log in</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="primary">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="mx-auto max-w-7xl px-6 text-center">

          {/* Badge */}
          <div className="mx-auto mb-8 w-fit animate-fade-in-up">
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              AI-Powered Certificate Extraction
              <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8">
            CPE compliance <br className="hidden sm:block"/>
            <span className="text-gray-400">on autopilot.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-500 mb-10 leading-relaxed">
            Stop wrestling with spreadsheets. Upload your certificates, we&apos;ll extract the data, track your compliance, and generate audit-ready reports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button variant="primary" className="h-12 px-8 text-base">
                Start for free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" className="h-12 px-8 text-base group">
                See how it works
                <ChevronRight className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </Button>
            </Link>
          </div>

          {/* Product Shot - Realistic Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-6xl">
            <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
              <div className="relative overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-gray-900/10">
                 <div className="w-full bg-white flex flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-8 bg-black rounded-lg"></div>
                            <span className="font-semibold text-gray-900">OrganizeMyCPE</span>
                        </div>
                        <div className="flex gap-3 items-center">
                             <span className="text-sm text-gray-500">John Smith, CPA</span>
                             <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-56 hidden md:block border-r border-gray-100 p-4 bg-gray-50/50">
                             <div className="space-y-1">
                                <div className="h-9 w-full bg-black text-white text-sm flex items-center px-3 rounded-lg font-medium">Dashboard</div>
                                <div className="h-9 w-full text-gray-500 text-sm flex items-center px-3 rounded-lg">My Courses</div>
                                <div className="h-9 w-full text-gray-500 text-sm flex items-center px-3 rounded-lg">Upload</div>
                                <div className="h-9 w-full text-gray-500 text-sm flex items-center px-3 rounded-lg">Exports</div>
                             </div>
                        </div>
                        {/* Main Content */}
                        <div className="flex-1 p-6 bg-gray-50/30">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                    <div className="text-xs text-gray-500 mb-2">Credits Earned</div>
                                    <div className="text-2xl font-bold text-gray-900">32 <span className="text-sm font-normal text-gray-400">/ 40</span></div>
                                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full w-4/5 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                     <div className="text-xs text-gray-500 mb-2">Ethics Credits</div>
                                     <div className="text-2xl font-bold text-gray-900">4 <span className="text-sm font-normal text-gray-400">/ 4</span></div>
                                     <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                       <div className="h-full w-full bg-green-500 rounded-full"></div>
                                     </div>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                     <div className="text-xs text-gray-500 mb-2">States Tracked</div>
                                     <div className="text-2xl font-bold text-gray-900">NY, CA</div>
                                     <div className="mt-2 text-xs text-green-600 font-medium">All compliant</div>
                                </div>
                            </div>
                            {/* Recent Courses Table */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                                    <span className="font-medium text-gray-900">Recent Courses</span>
                                    <button className="text-xs text-gray-500 hover:text-gray-700">View all</button>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[
                                      { name: 'Ethics in Professional Practice', credits: '4.0', field: 'Ethics', date: 'Dec 15' },
                                      { name: 'Advanced Tax Planning Strategies', credits: '8.0', field: 'Tax', date: 'Dec 10' },
                                      { name: 'GAAP Update 2024', credits: '4.0', field: 'A&A', date: 'Nov 28' },
                                    ].map((course, i) => (
                                        <div key={i} className="flex items-center justify-between px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                                                  course.field === 'Ethics' ? 'bg-purple-50 text-purple-600' :
                                                  course.field === 'Tax' ? 'bg-blue-50 text-blue-600' :
                                                  'bg-green-50 text-green-600'
                                                }`}>{course.credits}</div>
                                                <div>
                                                  <div className="text-sm text-gray-900">{course.name}</div>
                                                  <div className="text-xs text-gray-400">{course.field}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">{course.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
            {/* Glow effect behind */}
            <div className="absolute -top-12 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 bg-blue-500/20 blur-[100px]"></div>
          </div>
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="border-y border-gray-200 bg-white py-12">
        <p className="text-center text-sm font-medium text-gray-500 mb-8">Trusted by forward-thinking CPAs</p>
        <div className="relative flex overflow-hidden group">
          <div className="animate-marquee flex gap-16 whitespace-nowrap min-w-full justify-center opacity-40 grayscale">
            <span className="text-xl font-bold font-serif">Deloitte.</span>
            <span className="text-xl font-bold font-sans">KPMG</span>
            <span className="text-xl font-bold font-mono">PWC</span>
            <span className="text-xl font-bold font-serif">EY</span>
            <span className="text-xl font-bold font-sans">Grant Thornton</span>
            <span className="text-xl font-bold font-serif">BDO</span>
            <span className="text-xl font-bold font-serif">Deloitte.</span>
            <span className="text-xl font-bold font-sans">KPMG</span>
            <span className="text-xl font-bold font-mono">PWC</span>
            <span className="text-xl font-bold font-serif">EY</span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
           <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to stay compliant.</h2>
           <p className="mt-4 text-lg text-gray-500">Powerful features wrapped in a simple interface. We handle the complexity of state boards so you don&apos;t have to.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

           {/* Large Card - AI Extraction */}
           <div className="group relative rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md md:col-span-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 mb-4">
               <Zap className="h-5 w-5 text-gray-900" />
             </div>
             <h3 className="text-lg font-semibold text-gray-900">AI Extraction</h3>
             <p className="mt-2 text-sm text-gray-500 max-w-md">Drag and drop your PDF certificates. Our AI instantly captures the course name, date, credit amount, and field of study.</p>

             {/* Demo UI - fixed positioning */}
             <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
               <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                 <div className="h-12 w-12 bg-red-50 rounded-lg text-red-600 flex items-center justify-center text-sm font-bold border border-red-100">PDF</div>
                 <div className="flex-1">
                   <div className="text-sm font-medium text-gray-900">Ethics_Certificate_2024.pdf</div>
                   <div className="text-xs text-gray-400">Uploaded just now</div>
                 </div>
                 <ArrowRight className="text-gray-300 h-5 w-5 mx-2" />
                 <div className="h-7 px-3 bg-green-50 text-green-700 text-xs font-medium flex items-center justify-center rounded-full border border-green-100">Extracted</div>
               </div>
               <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div>
                   <div className="text-xs text-gray-400 mb-1">Course</div>
                   <div className="text-sm font-medium text-gray-900">Ethics 101</div>
                 </div>
                 <div>
                   <div className="text-xs text-gray-400 mb-1">Credits</div>
                   <div className="text-sm font-medium text-gray-900">2.0</div>
                 </div>
                 <div>
                   <div className="text-xs text-gray-400 mb-1">Field</div>
                   <div className="text-sm font-medium text-gray-900">Behavioral Ethics</div>
                 </div>
                 <div>
                   <div className="text-xs text-gray-400 mb-1">Date</div>
                   <div className="text-sm font-medium text-gray-900">Dec 15, 2024</div>
                 </div>
               </div>
             </div>
           </div>

           {/* Tall Card - All 50 States */}
           <div className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-black p-6 shadow-sm transition-shadow hover:shadow-md md:row-span-2 text-white">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 bg-gray-900 mb-4">
               <Globe className="h-5 w-5 text-white" />
             </div>
             <h3 className="text-lg font-semibold">All 50 States + DC</h3>
             <p className="mt-2 text-sm text-gray-400">We track unique CPE rules for every state board, including Ethics, A&A, and technical requirements.</p>

             {/* State grid showing all states */}
             <div className="mt-6 grid grid-cols-5 gap-1.5">
                {['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
                  'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
                  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
                  'NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
                  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map((state) => (
                    <div
                      key={state}
                      className={`rounded px-1 py-1.5 text-center text-[10px] font-mono transition-all ${
                        ['NY', 'CA', 'TX', 'FL', 'IL'].includes(state)
                          ? 'bg-white text-black font-medium'
                          : 'bg-gray-800/80 text-gray-400'
                      }`}
                    >
                      {state}
                    </div>
                ))}
             </div>

             <p className="mt-4 text-xs text-gray-500">Highlighted: Most common jurisdictions</p>
           </div>

           {/* Small Card */}
           <BentoCard
             title="Audit Ready"
             description="One-click export of all your certificates and a summary report."
             icon={FileText}
           />

           {/* Small Card */}
           <BentoCard
             title="Secure Storage"
             description="Bank-level AES-256 encryption for all your documents."
             icon={ShieldCheck}
           />

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-gray-500">Less than a single CPE course.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="text-sm text-gray-500 mt-1">Try it out</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                  Up to 10 document uploads
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                  1 state export
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                  Basic compliance dashboard
                </li>
              </ul>
              <Link href="/sign-up" className="block mt-8">
                <Button variant="secondary" className="w-full h-12">Get started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl border-2 border-black bg-white p-8 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">Most popular</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="text-sm text-gray-500 mt-1">Full access</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-500 ml-1">/year</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  Unlimited document uploads
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  All 50 state exports
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  Full compliance dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
                  Priority support
                </li>
              </ul>
              <Link href="/sign-up" className="block mt-8">
                <Button variant="primary" className="w-full h-12">Get Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-6">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                  <span className="font-bold text-xl">OrganizeMyCPE</span>
                  <p className="text-sm text-gray-500 mt-1">&copy; 2025 Organize My CPE. All rights reserved.</p>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                  <Link href="/privacy" className="hover:text-black">Privacy</Link>
                  <Link href="/terms" className="hover:text-black">Terms</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}
