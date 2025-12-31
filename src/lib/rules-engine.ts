import { db } from './db'
import type { CourseRecord, StateRule } from '@prisma/client'
import type { ComplianceState } from '@/types'

// Field of study categories for mapping
const ETHICS_KEYWORDS = ['ethics', 'professional responsibility', 'regulatory ethics']
const ACCOUNTING_AUDITING_KEYWORDS = ['accounting', 'auditing', 'attest', 'a&a', 'gaap', 'gaas', 'financial reporting']
const TAX_KEYWORDS = ['tax', 'taxation', 'irs', 'internal revenue']

/**
 * Determine if a field of study qualifies as ethics
 */
function isEthicsCourse(fieldOfStudy: string | null): boolean {
  if (!fieldOfStudy) return false
  const lower = fieldOfStudy.toLowerCase()
  return ETHICS_KEYWORDS.some(kw => lower.includes(kw))
}

/**
 * Determine if a field of study qualifies as accounting/auditing
 */
function isAccountingAuditingCourse(fieldOfStudy: string | null): boolean {
  if (!fieldOfStudy) return false
  const lower = fieldOfStudy.toLowerCase()
  return ACCOUNTING_AUDITING_KEYWORDS.some(kw => lower.includes(kw))
}

/**
 * Determine if a field of study qualifies as taxation
 */
function isTaxCourse(fieldOfStudy: string | null): boolean {
  if (!fieldOfStudy) return false
  const lower = fieldOfStudy.toLowerCase()
  return TAX_KEYWORDS.some(kw => lower.includes(kw))
}

/**
 * Determine if a course counts as live/interactive
 */
function isLiveCourse(deliveryMethod: string): boolean {
  return ['LIVE', 'WEBINAR'].includes(deliveryMethod)
}

/**
 * Determine if a course is technical (vs behavioral/personal development)
 */
function isTechnicalCourse(fieldOfStudy: string | null): boolean {
  if (!fieldOfStudy) return true // Default to technical if unspecified
  const lower = fieldOfStudy.toLowerCase()
  const nonTechnical = ['personal development', 'communication', 'leadership', 'management skills', 'soft skills']
  return !nonTechnical.some(kw => lower.includes(kw))
}

/**
 * Calculate the current reporting cycle dates based on state rules
 */
export function calculateCycleDates(rule: StateRule, referenceDate: Date = new Date()): { start: Date; end: Date } {
  const year = referenceDate.getFullYear()

  switch (rule.cycleType) {
    case 'CALENDAR_YEAR':
      // Annual cycle from Jan 1 - Dec 31
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      }

    case 'BIENNIAL_EVEN':
      // Two-year cycle ending in even years
      const evenEndYear = year % 2 === 0 ? year : year + 1
      return {
        start: new Date(evenEndYear - 1, 0, 1),
        end: new Date(evenEndYear, 11, 31),
      }

    case 'BIENNIAL_ODD':
      // Two-year cycle ending in odd years
      const oddEndYear = year % 2 === 1 ? year : year + 1
      return {
        start: new Date(oddEndYear - 1, 0, 1),
        end: new Date(oddEndYear, 11, 31),
      }

    case 'ROLLING':
      // Rolling 3-year period from current date
      const rollingStart = new Date(year - (rule.cycleLengthYears - 1), 0, 1)
      return {
        start: rollingStart,
        end: new Date(year, 11, 31),
      }

    case 'ANNIVERSARY':
      // Based on license date - fall back to calendar year
      return {
        start: new Date(year - (rule.cycleLengthYears - 1), 0, 1),
        end: new Date(year, 11, 31),
      }

    case 'FISCAL_YEAR':
      // State fiscal year - varies by state, default to July-June
      const fiscalStartMonth = rule.cycleStartMonth || 7
      if (referenceDate.getMonth() >= fiscalStartMonth - 1) {
        return {
          start: new Date(year, fiscalStartMonth - 1, 1),
          end: new Date(year + 1, fiscalStartMonth - 1, 0),
        }
      } else {
        return {
          start: new Date(year - 1, fiscalStartMonth - 1, 1),
          end: new Date(year, fiscalStartMonth - 1, 0),
        }
      }

    default:
      // Default to calendar year
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      }
  }
}

/**
 * Calculate compliance for a single state
 * @param stateCode - The state code to calculate compliance for
 * @param courses - User's course records
 * @param referenceDate - Reference date for cycle calculation
 * @param rule - Optional pre-loaded state rule (avoids N+1 queries)
 */
export async function calculateStateCompliance(
  stateCode: string,
  courses: CourseRecord[],
  referenceDate: Date = new Date(),
  rule?: StateRule | null
): Promise<ComplianceState | null> {
  // Use provided rule or fetch it (supports both optimized batch and individual calls)
  const stateRule = rule ?? await db.stateRule.findUnique({
    where: { stateCode },
  })

  if (!stateRule) return null

  const { start, end } = calculateCycleDates(stateRule, referenceDate)

  // Filter courses within the cycle period
  const cycleCourses = courses.filter(course => {
    const completionDate = new Date(course.completionDate)
    return completionDate >= start && completionDate <= end && !course.isDuplicate
  })

  // Calculate totals
  let totalCompleted = 0
  let ethicsCompleted = 0
  let liveCompleted = 0
  let accountingAuditingCompleted = 0
  let taxCompleted = 0
  let technicalCompleted = 0

  for (const course of cycleCourses) {
    const credits = Number(course.credits)
    totalCompleted += credits

    if (isEthicsCourse(course.fieldOfStudy)) {
      ethicsCompleted += credits
    }

    if (isLiveCourse(course.deliveryMethod)) {
      liveCompleted += credits
    }

    if (isAccountingAuditingCourse(course.fieldOfStudy)) {
      accountingAuditingCompleted += credits
    }

    if (isTaxCourse(course.fieldOfStudy)) {
      taxCompleted += credits
    }

    if (isTechnicalCourse(course.fieldOfStudy)) {
      technicalCompleted += credits
    }
  }

  // Determine missing requirements
  const missingRequirements: string[] = []

  if (totalCompleted < stateRule.totalHoursRequired) {
    const remaining = stateRule.totalHoursRequired - totalCompleted
    missingRequirements.push(`Need ${remaining.toFixed(1)} more hours`)
  }

  if (ethicsCompleted < stateRule.ethicsHoursRequired) {
    const remaining = stateRule.ethicsHoursRequired - ethicsCompleted
    missingRequirements.push(`Need ${remaining.toFixed(1)} more ethics hours`)
  }

  if (liveCompleted < stateRule.minLiveHours) {
    const remaining = stateRule.minLiveHours - liveCompleted
    missingRequirements.push(`Need ${remaining.toFixed(1)} more live/interactive hours`)
  }

  // Check subject minimums from JSON
  const subjectMinimums = stateRule.subjectMinimums as Record<string, number> | null
  if (subjectMinimums) {
    if (subjectMinimums.accounting_auditing && accountingAuditingCompleted < subjectMinimums.accounting_auditing) {
      const remaining = subjectMinimums.accounting_auditing - accountingAuditingCompleted
      missingRequirements.push(`Need ${remaining.toFixed(1)} more A&A hours`)
    }
    if (subjectMinimums.taxation && taxCompleted < subjectMinimums.taxation) {
      const remaining = subjectMinimums.taxation - taxCompleted
      missingRequirements.push(`Need ${remaining.toFixed(1)} more tax hours`)
    }
    if (subjectMinimums.technical && technicalCompleted < subjectMinimums.technical) {
      const remaining = subjectMinimums.technical - technicalCompleted
      missingRequirements.push(`Need ${remaining.toFixed(1)} more technical hours`)
    }
  }

  const isCompliant = missingRequirements.length === 0

  // Build subject breakdown
  const subjectBreakdown: Record<string, { required: number; completed: number }> = {
    ethics: { required: stateRule.ethicsHoursRequired, completed: ethicsCompleted },
  }

  if (stateRule.minLiveHours > 0) {
    subjectBreakdown.live = { required: stateRule.minLiveHours, completed: liveCompleted }
  }

  if (subjectMinimums) {
    if (subjectMinimums.accounting_auditing) {
      subjectBreakdown.accounting_auditing = {
        required: subjectMinimums.accounting_auditing,
        completed: accountingAuditingCompleted
      }
    }
    if (subjectMinimums.taxation) {
      subjectBreakdown.taxation = {
        required: subjectMinimums.taxation,
        completed: taxCompleted
      }
    }
    if (subjectMinimums.technical) {
      subjectBreakdown.technical = {
        required: subjectMinimums.technical,
        completed: technicalCompleted
      }
    }
  }

  return {
    stateCode: stateRule.stateCode,
    stateName: stateRule.stateName,
    totalRequired: stateRule.totalHoursRequired,
    totalCompleted,
    ethicsRequired: stateRule.ethicsHoursRequired,
    ethicsCompleted,
    liveRequired: stateRule.minLiveHours,
    liveCompleted,
    subjectBreakdown,
    isCompliant,
    missingRequirements,
    cycleStart: start,
    cycleEnd: end,
  }
}

/**
 * Calculate compliance for all selected states
 * Optimized to batch-load state rules to avoid N+1 queries
 */
export async function calculateUserCompliance(
  userId: string,
  selectedStates: string[]
): Promise<ComplianceState[]> {
  // Get all user's courses in one query
  const courses = await db.courseRecord.findMany({
    where: {
      userId,
      isDuplicate: false,
    },
  })

  // Batch-load all state rules in one query (avoids N+1)
  const stateRules = await db.stateRule.findMany({
    where: {
      stateCode: { in: selectedStates },
    },
  })

  // Create a map for O(1) lookup
  const rulesMap = new Map(stateRules.map(rule => [rule.stateCode, rule]))

  const results: ComplianceState[] = []

  for (const stateCode of selectedStates) {
    const rule = rulesMap.get(stateCode)
    const compliance = await calculateStateCompliance(stateCode, courses, new Date(), rule)
    if (compliance) {
      results.push(compliance)
    }
  }

  return results
}

/**
 * Get state rule by code
 */
export async function getStateRule(stateCode: string): Promise<StateRule | null> {
  return db.stateRule.findUnique({
    where: { stateCode },
  })
}

/**
 * Get all state rules
 */
export async function getAllStateRules(): Promise<StateRule[]> {
  return db.stateRule.findMany({
    orderBy: { stateName: 'asc' },
  })
}
