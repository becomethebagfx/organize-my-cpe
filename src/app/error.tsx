"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    console.error("App error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-light transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            Go Home
          </a>
        </div>
        {error.digest && (
          <p className="mt-4 text-sm text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  )
}
