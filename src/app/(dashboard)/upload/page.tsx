"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "failed"
  progress: number
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setUploading(true)

    // Create FormData and upload
    const formData = new FormData()
    acceptedFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFiles((prev) =>
          prev.map((f) => {
            const uploaded = result.data.documents.find(
              (d: { filename: string }) => d.filename === f.name
            )
            if (uploaded) {
              return { ...f, status: "completed" as const, progress: 100 }
            }
            return { ...f, status: "completed" as const, progress: 100 }
          })
        )
      } else {
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "failed" as const,
            error: result.error,
          }))
        )
      }
    } catch {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "failed" as const,
          error: "Upload failed",
        }))
      )
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/zip": [".zip"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const clearFiles = () => {
    setFiles([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Certificates</h1>
        <p className="text-muted-foreground">
          Drop your CPE certificates and spreadsheets here
        </p>
      </div>

      {/* Dropzone */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here
                </p>
                <p className="text-muted-foreground mb-4">
                  or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Accepts PDF, CSV, XLSX, and ZIP files (max 50MB each)
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
              <CardDescription>
                {files.filter((f) => f.status === "completed").length} of{" "}
                {files.length} completed
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearFiles}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                >
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatSize(file.size)}
                    </p>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                    {file.error && (
                      <p className="text-sm text-destructive mt-1">
                        {file.error}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {file.status === "uploading" && (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                    {file.status === "processing" && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                    {file.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {file.status === "failed" && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">PDF Certificates</p>
              <p className="text-muted-foreground">
                Upload individual CPE certificate PDFs. We&apos;ll extract course
                details automatically.
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">ZIP Archives</p>
              <p className="text-muted-foreground">
                Bundle multiple PDFs in a ZIP file for batch processing.
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">CSV Files</p>
              <p className="text-muted-foreground">
                Import from CPE tracking spreadsheets with course data.
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">Excel Files</p>
              <p className="text-muted-foreground">
                Upload XLSX/XLS files with your CPE records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Notice */}
      {uploading && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Processing your files...</span>
        </div>
      )}
    </div>
  )
}
