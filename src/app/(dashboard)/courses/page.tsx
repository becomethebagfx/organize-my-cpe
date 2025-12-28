"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Edit2,
  CheckCircle,
} from "lucide-react"

interface Course {
  id: string
  providerName: string | null
  courseTitle: string
  completionDate: string
  deliveryMethod: string
  fieldOfStudy: string | null
  credits: number
  sponsorId: string | null
  certificateNumber: string | null
  confidence: number
  needsReview: boolean
  documentName?: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "review" | "duplicates">("all")

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (data.success) {
          setCourses(data.data.courses)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === "" ||
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.providerName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "review" && course.needsReview)

    return matchesSearch && matchesFilter
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCourses.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCourses.map((c) => c.id)))
    }
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return

    for (const id of selectedIds) {
      try {
        await fetch(`/api/courses/${id}`, { method: "DELETE" })
      } catch (error) {
        console.error("Failed to delete course:", error)
      }
    }

    setCourses((prev) => prev.filter((c) => !selectedIds.has(c.id)))
    setSelectedIds(new Set())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const totalCredits = filteredCourses.reduce((sum, c) => sum + c.credits, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Course Records</h1>
          <p className="text-muted-foreground">
            {courses.length} courses • {totalCredits.toFixed(1)} total credits
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "review" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("review")}
              >
                Needs Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <CardTitle>No courses yet</CardTitle>
            <CardDescription>
              Upload certificates or add courses manually to get started
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedIds.size === filteredCourses.length}
                  onCheckedChange={toggleSelectAll}
                />
              </div>
              <div className="col-span-4">Course</div>
              <div className="col-span-2">Provider</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1 text-right">Credits</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Course Rows */}
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grid md:grid-cols-12 gap-4 p-4 border-b last:border-0 hover:bg-muted/30"
              >
                <div className="md:col-span-1 flex items-center">
                  <Checkbox
                    checked={selectedIds.has(course.id)}
                    onCheckedChange={() => toggleSelect(course.id)}
                  />
                </div>
                <div className="md:col-span-4">
                  <p className="font-medium">{course.courseTitle}</p>
                  <p className="text-sm text-muted-foreground md:hidden">
                    {course.providerName} • {formatDate(course.completionDate)}
                  </p>
                </div>
                <div className="hidden md:block md:col-span-2 text-sm">
                  {course.providerName || "-"}
                </div>
                <div className="hidden md:block md:col-span-2 text-sm">
                  {formatDate(course.completionDate)}
                </div>
                <div className="hidden md:block md:col-span-1 text-right text-sm font-medium">
                  {course.credits.toFixed(1)}
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  {course.needsReview ? (
                    <span className="flex items-center gap-1 text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Review
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  )}
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
