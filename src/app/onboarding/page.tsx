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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Organize My CPE</h1>
          <p className="text-gray-400 text-lg">
            Hi {user?.firstName || 'there'}! Let&apos;s get you set up in just a moment.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-semibold">Quick Overview</h2>
              </div>

              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong>Upload certificates</strong> - PDF, CSV, or XLSX files with your CPE records</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong>AI extracts details</strong> - Course name, credits, dates automatically detected</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong>Track compliance</strong> - See your progress for all 51 jurisdictions</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><strong>Export reports</strong> - Generate state-specific compliance reports</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-semibold">You&apos;re All Set!</h2>
              </div>

              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300 text-lg mb-2">Your account is ready!</p>
                <p className="text-gray-400">Start by uploading your first CPE certificate.</p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm">
            Skip onboarding and go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
