import * as XLSX from 'xlsx'
import { db } from './db'
import { getStateRule, calculateCycleDates } from './rules-engine'
import type { CourseRecord, StateRule } from '@prisma/client'

interface ExportOptions {
  userId: string
  stateCode?: string
  format: 'csv' | 'xlsx'
}

interface ExportResult {
  filename: string
  mimeType: string
  data: Buffer
}

/**
 * Format a date for export (MM/DD/YYYY)
 */
function formatDate(date: Date): string {
  const d = new Date(date)
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`
}

/**
 * Map delivery method to common format
 */
function mapDeliveryMethod(method: string): string {
  const mapping: Record<string, string> = {
    SELF_STUDY: 'Self-Study',
    LIVE: 'Live/Instructor-Led',
    WEBINAR: 'Webinar',
    HYBRID: 'Hybrid',
    UNKNOWN: 'Unknown',
  }
  return mapping[method] || method
}

/**
 * Generate canonical export (all courses in standard format)
 */
export async function generateCanonicalExport(options: ExportOptions): Promise<ExportResult> {
  const { userId, format } = options

  const courses = await db.courseRecord.findMany({
    where: {
      userId,
      isDuplicate: false,
    },
    orderBy: { completionDate: 'desc' },
    include: {
      document: {
        select: { originalName: true },
      },
    },
  })

  const rows = courses.map(course => ({
    'Course Title': course.courseTitle,
    'Provider/Sponsor': course.providerName || '',
    'Completion Date': formatDate(course.completionDate),
    'CPE Hours': Number(course.credits).toFixed(1),
    'Field of Study': course.fieldOfStudy || '',
    'Delivery Method': mapDeliveryMethod(course.deliveryMethod),
    'NASBA Sponsor ID': course.sponsorId || '',
    'Certificate Number': course.certificateNumber || '',
    'Source Document': course.document?.originalName || 'Manual Entry',
  }))

  return generateFile(rows, `cpe-courses-${formatDateForFilename(new Date())}`, format)
}

/**
 * Generate state-specific export
 */
export async function generateStateExport(
  options: ExportOptions & { stateCode: string }
): Promise<ExportResult | null> {
  const { userId, stateCode, format } = options

  const rule = await getStateRule(stateCode)
  if (!rule) return null

  const { start, end } = calculateCycleDates(rule)

  const courses = await db.courseRecord.findMany({
    where: {
      userId,
      isDuplicate: false,
      completionDate: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { completionDate: 'desc' },
  })

  // Different states may have different export formats
  const rows = courses.map(course => formatCourseForState(course, rule))

  const filename = `cpe-${stateCode.toLowerCase()}-${formatDateForFilename(new Date())}`
  return generateFile(rows, filename, format)
}

/**
 * Format a course row based on state requirements
 */
function formatCourseForState(course: CourseRecord, rule: StateRule): Record<string, string | number> {
  // Base fields that most states require
  const baseRow: Record<string, string | number> = {
    'Course Title': course.courseTitle,
    'Provider Name': course.providerName || '',
    'Completion Date': formatDate(course.completionDate),
    'CPE Credits': Number(course.credits).toFixed(2),
    'Field of Study': course.fieldOfStudy || '',
    'Delivery Method': mapDeliveryMethod(course.deliveryMethod),
    'Sponsor ID (NASBA)': course.sponsorId || '',
    'Certificate/Confirmation #': course.certificateNumber || '',
  }

  // Add state-specific fields based on rule configuration
  // State template schemas can define additional required fields
  const templateSchema = rule.templateSchema as Record<string, string> | null
  if (templateSchema) {
    // Map our fields to state-specific column names
    const mappedRow: Record<string, string | number> = {}
    for (const [ourField, stateField] of Object.entries(templateSchema)) {
      if (ourField in baseRow) {
        mappedRow[stateField] = baseRow[ourField]
      }
    }
    return mappedRow
  }

  return baseRow
}

/**
 * Generate compliance summary report
 */
export async function generateComplianceSummary(userId: string): Promise<ExportResult> {
  const user = await db.userProfile.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const courses = await db.courseRecord.findMany({
    where: {
      userId,
      isDuplicate: false,
    },
    orderBy: { completionDate: 'desc' },
  })

  const summaryRows: Record<string, string | number>[] = []

  // Add header info
  summaryRows.push({
    'Report Type': 'CPE Compliance Summary',
    'Generated': formatDate(new Date()),
    'Total Courses': courses.length,
    'Total Credits': courses.reduce((sum, c) => sum + Number(c.credits), 0).toFixed(1),
  })

  // Add per-state summary
  for (const stateCode of user.selectedStates) {
    const rule = await getStateRule(stateCode)
    if (!rule) continue

    const { start, end } = calculateCycleDates(rule)
    const stateCourses = courses.filter(c => {
      const date = new Date(c.completionDate)
      return date >= start && date <= end
    })

    const totalCredits = stateCourses.reduce((sum, c) => sum + Number(c.credits), 0)
    const ethicsCredits = stateCourses
      .filter(c => c.fieldOfStudy?.toLowerCase().includes('ethics'))
      .reduce((sum, c) => sum + Number(c.credits), 0)

    summaryRows.push({
      'State': rule.stateName,
      'Cycle': `${formatDate(start)} - ${formatDate(end)}`,
      'Required Hours': rule.totalHoursRequired,
      'Completed Hours': totalCredits.toFixed(1),
      'Ethics Required': rule.ethicsHoursRequired,
      'Ethics Completed': ethicsCredits.toFixed(1),
      'Status': totalCredits >= rule.totalHoursRequired && ethicsCredits >= rule.ethicsHoursRequired
        ? 'Compliant'
        : 'In Progress',
    })
  }

  return generateFile(summaryRows, `cpe-summary-${formatDateForFilename(new Date())}`, 'xlsx')
}

/**
 * Generate file in specified format
 */
function generateFile(
  rows: Record<string, string | number>[],
  filename: string,
  format: 'csv' | 'xlsx'
): ExportResult {
  if (rows.length === 0) {
    // Empty result
    return {
      filename: `${filename}.${format}`,
      mimeType: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: Buffer.from(''),
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CPE Records')

  if (format === 'csv') {
    const csvData = XLSX.utils.sheet_to_csv(worksheet)
    return {
      filename: `${filename}.csv`,
      mimeType: 'text/csv',
      data: Buffer.from(csvData, 'utf-8'),
    }
  } else {
    const xlsxData = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    return {
      filename: `${filename}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      data: Buffer.from(xlsxData),
    }
  }
}

/**
 * Format date for filename (YYYY-MM-DD)
 */
function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0]
}
