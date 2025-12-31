"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "2rem", maxWidth: "400px" }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #2563eb",
                  color: "#2563eb",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontSize: "1rem"
                }}
              >
                Go Home
              </a>
            </div>
            {error.digest && (
              <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#6b7280" }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
