import { z } from 'zod'

// Course record schema for validation
export const courseRecordSchema = z.object({
  providerName: z.string().nullable(),
  courseTitle: z.string().min(1, 'Course title is required'),
  completionDate: z.coerce.date(),
  deliveryMethod: z.enum(['SELF_STUDY', 'LIVE', 'WEBINAR', 'HYBRID', 'UNKNOWN']),
  fieldOfStudy: z.string().nullable(),
  credits: z.coerce.number().min(0).max(999),
  sponsorId: z.string().nullable(),
  certificateNumber: z.string().nullable(),
})

export type CourseRecordInput = z.infer<typeof courseRecordSchema>

// LLM extraction response
export const extractedCourseSchema = z.object({
  providerName: z.string().nullable(),
  courseTitle: z.string().nullable(),
  completionDate: z.string().nullable(), // ISO date string
  deliveryMethod: z.enum(['SELF_STUDY', 'LIVE', 'WEBINAR', 'HYBRID', 'UNKNOWN']).nullable(),
  fieldOfStudy: z.string().nullable(),
  credits: z.number().nullable(),
  sponsorId: z.string().nullable(),
  certificateNumber: z.string().nullable(),
  confidence: z.number().min(0).max(1),
})

export type ExtractedCourse = z.infer<typeof extractedCourseSchema>

// Compliance calculation types
export interface ComplianceState {
  stateCode: string
  stateName: string
  totalRequired: number
  totalCompleted: number
  ethicsRequired: number
  ethicsCompleted: number
  liveRequired: number
  liveCompleted: number
  subjectBreakdown: Record<string, { required: number; completed: number }>
  isCompliant: boolean
  missingRequirements: string[]
  cycleStart: Date
  cycleEnd: Date
}

export interface ComplianceSummary {
  states: ComplianceState[]
  totalCourses: number
  needsReviewCount: number
}

// Upload types
export interface UploadedFile {
  id: string
  filename: string
  originalName: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  size: number
  createdAt: Date
}

// State selection
export interface StateOption {
  code: string
  name: string
  totalHours: number
  ethicsHours: number
  cycleType: string
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
