'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);

  useEffect(() => {
    // If not signed in, redirect to sign-in
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleComplete = () => {
    router.push('/dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-8 rounded bg-brand-primary"></div>
            <span className="font-bold text-xl">OrganizeMyCPE</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Organize My CPE</h1>
          <p className="text-muted-foreground text-lg">
            Hi {user?.firstName || 'there'}! Let&apos;s get you set up in just a moment.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-semibold">Quick Overview</h2>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong className="text-foreground">Upload certificates</strong> - PDF, CSV, or XLSX files with your CPE records</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong className="text-foreground">AI extracts details</strong> - Course name, credits, dates automatically detected</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong className="text-foreground">Track compliance</strong> - See your progress for all 51 jurisdictions</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong className="text-foreground">Export reports</strong> - Generate state-specific compliance reports</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-brand-primary hover:bg-brand-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-semibold">You&apos;re All Set!</h2>
              </div>

              <div className="text-center py-8">
                <div className="w-20 h-20 bg-brand-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-brand-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-foreground text-lg mb-2">Your account is ready!</p>
                <p className="text-muted-foreground">Start by uploading your first CPE certificate.</p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full mt-8 bg-brand-primary hover:bg-brand-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Skip onboarding and go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
