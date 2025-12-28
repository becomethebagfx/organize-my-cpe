"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import type { ComplianceSummary } from "@/types"

export default function DashboardPage() {
  const [compliance, setCompliance] = useState<ComplianceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompliance() {
      try {
        const res = await fetch("/api/compliance")
        const data = await res.json()
        if (data.success) {
          setCompliance(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch compliance:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompliance()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const hasStates = compliance && compliance.states.length > 0
  const hasCourses = compliance && compliance.totalCourses > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your CPE compliance across states
          </p>
        </div>
        <Link href="/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Certificates
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{compliance?.totalCourses || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>States Tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{compliance?.states.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Needs Review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {compliance?.needsReviewCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {!hasStates && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Select the states where you hold CPA licenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/settings">
              <Button variant="outline" className="gap-2">
                Select States
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {hasStates && !hasCourses && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Upload Your First Certificate</CardTitle>
            <CardDescription>
              Drop your PDFs, spreadsheets, or ZIP files to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* State Compliance Cards */}
      {hasStates && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Compliance by State</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {compliance?.states.map((state) => {
              const progress = Math.min(
                100,
                (state.totalCompleted / state.totalRequired) * 100
              )
              const ethicsProgress =
                state.ethicsRequired > 0
                  ? Math.min(
                      100,
                      (state.ethicsCompleted / state.ethicsRequired) * 100
                    )
                  : 100

              return (
                <Card key={state.stateCode}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {state.stateName}
                      </CardTitle>
                      {state.isCompliant ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <CardDescription>
                      Cycle:{" "}
                      {new Date(state.cycleStart).toLocaleDateString()} -{" "}
                      {new Date(state.cycleEnd).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Total Hours */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total Hours</span>
                        <span className="font-medium">
                          {state.totalCompleted.toFixed(1)} /{" "}
                          {state.totalRequired} hrs
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* Ethics Hours */}
                    {state.ethicsRequired > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Ethics</span>
                          <span className="font-medium">
                            {state.ethicsCompleted.toFixed(1)} /{" "}
                            {state.ethicsRequired} hrs
                          </span>
                        </div>
                        <Progress value={ethicsProgress} />
                      </div>
                    )}

                    {/* Missing Requirements */}
                    {state.missingRequirements.length > 0 && (
                      <div className="text-sm text-amber-600">
                        {state.missingRequirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {req}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link href={`/exports?state=${state.stateCode}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Export {state.stateCode} Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
