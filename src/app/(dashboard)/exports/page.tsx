"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, Archive, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface ExportOption {
  id: string
  title: string
  description: string
  icon: React.ElementType
  type: string
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "canonical-csv",
    title: "All Courses (CSV)",
    description: "Export all your courses in our standard format",
    icon: FileSpreadsheet,
    type: "CANONICAL_CSV",
  },
  {
    id: "canonical-xlsx",
    title: "All Courses (Excel)",
    description: "Export all your courses as an Excel file",
    icon: FileSpreadsheet,
    type: "CANONICAL_XLSX",
  },
  {
    id: "certificate-zip",
    title: "Certificate Bundle",
    description: "Download all uploaded certificates in a ZIP file",
    icon: Archive,
    type: "CERTIFICATE_ZIP",
  },
  {
    id: "summary-pdf",
    title: "Summary Report",
    description: "Generate a printable compliance summary",
    icon: FileText,
    type: "SUMMARY_PDF",
  },
]

export default function ExportsPage() {
  const [exporting, setExporting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleExport = async (type: string) => {
    setExporting(type)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`/api/exports/${type.toLowerCase()}`, {
        method: "POST",
      })

      // Check if response is JSON (error) or file (success)
      const contentType = response.headers.get("content-type")

      if (!response.ok || contentType?.includes("application/json")) {
        // API returned an error
        const data = await response.json()
        throw new Error(data.error || "Export failed")
      }

      const blob = await response.blob()

      // Check for empty file
      if (blob.size === 0) {
        throw new Error("No courses found to export. Upload some certificates first!")
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cpe-export-${type.toLowerCase()}.${getExtension(type)}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSuccess(`${getExportName(type)} downloaded successfully!`)
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed"
      setError(message)
      console.error("Export failed:", err)
    } finally {
      setExporting(null)
    }
  }

  const getExportName = (type: string) => {
    const option = EXPORT_OPTIONS.find(o => o.type === type)
    return option?.title || type
  }

  const getExtension = (type: string) => {
    switch (type) {
      case "CANONICAL_CSV":
        return "csv"
      case "CANONICAL_XLSX":
        return "xlsx"
      case "CERTIFICATE_ZIP":
        return "zip"
      case "SUMMARY_PDF":
        return "pdf"
      default:
        return "txt"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exports</h1>
        <p className="text-muted-foreground">
          Download your CPE data in various formats
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* General Exports */}
      <Card>
        <CardHeader>
          <CardTitle>General Exports</CardTitle>
          <CardDescription>
            Download your data in standard formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {EXPORT_OPTIONS.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-4 p-4 border rounded-lg"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <option.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-2"
                    onClick={() => handleExport(option.type)}
                    disabled={exporting === option.type}
                  >
                    {exporting === option.type ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* State-Specific Exports */}
      <Card>
        <CardHeader>
          <CardTitle>State-Specific Exports</CardTitle>
          <CardDescription>
            Download reports formatted for specific state boards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Select states in Settings</p>
            <p className="text-sm">
              Configure your licensed states to see state-specific export
              options
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>
            Previously generated exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No exports yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
