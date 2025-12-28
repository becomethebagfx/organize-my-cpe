import { describe, it, expect } from 'vitest'
import { calculateCycleDates } from './rules-engine'

// Mock StateRule type for testing
const createMockRule = (overrides: Partial<{
  cycleType: string
  cycleLengthYears: number
  cycleStartMonth: number | null
}>) => ({
  id: 'test-id',
  stateCode: 'CA',
  stateName: 'California',
  totalHoursRequired: 80,
  ethicsHoursRequired: 4,
  minLiveHours: 0,
  cycleType: 'CALENDAR_YEAR',
  cycleLengthYears: 1,
  cycleStartMonth: null,
  cycleStartDay: null,
  carryoverAllowed: false,
  maxCarryoverHours: null,
  hasImportTemplate: false,
  templateSchema: null,
  manualEntryFields: null,
  notes: null,
  boardName: 'Test Board',
  boardUrl: 'https://example.com',
  subjectMinimums: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
}) as unknown as Parameters<typeof calculateCycleDates>[0]

describe('calculateCycleDates', () => {
  describe('CALENDAR_YEAR cycle', () => {
    it('should return Jan 1 - Dec 31 of current year', () => {
      const rule = createMockRule({ cycleType: 'CALENDAR_YEAR', cycleLengthYears: 1 })
      const referenceDate = new Date('2024-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2024)
      expect(start.getMonth()).toBe(0) // January
      expect(start.getDate()).toBe(1)

      expect(end.getFullYear()).toBe(2024)
      expect(end.getMonth()).toBe(11) // December
      expect(end.getDate()).toBe(31)
    })
  })

  describe('BIENNIAL_EVEN cycle', () => {
    it('should return 2-year cycle ending in even year when in even year', () => {
      const rule = createMockRule({ cycleType: 'BIENNIAL_EVEN', cycleLengthYears: 2 })
      const referenceDate = new Date('2024-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2023)
      expect(end.getFullYear()).toBe(2024)
    })

    it('should return 2-year cycle ending in next even year when in odd year', () => {
      const rule = createMockRule({ cycleType: 'BIENNIAL_EVEN', cycleLengthYears: 2 })
      const referenceDate = new Date('2025-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2025)
      expect(end.getFullYear()).toBe(2026)
    })
  })

  describe('BIENNIAL_ODD cycle', () => {
    it('should return 2-year cycle ending in odd year when in odd year', () => {
      const rule = createMockRule({ cycleType: 'BIENNIAL_ODD', cycleLengthYears: 2 })
      const referenceDate = new Date('2025-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2024)
      expect(end.getFullYear()).toBe(2025)
    })

    it('should return 2-year cycle ending in next odd year when in even year', () => {
      const rule = createMockRule({ cycleType: 'BIENNIAL_ODD', cycleLengthYears: 2 })
      const referenceDate = new Date('2024-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2024)
      expect(end.getFullYear()).toBe(2025)
    })
  })

  describe('ROLLING cycle', () => {
    it('should return 3-year rolling period for typical rolling states', () => {
      const rule = createMockRule({ cycleType: 'ROLLING', cycleLengthYears: 3 })
      const referenceDate = new Date('2024-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2022)
      expect(end.getFullYear()).toBe(2024)
    })
  })

  describe('FISCAL_YEAR cycle', () => {
    it('should return July-June fiscal year when in second half', () => {
      const rule = createMockRule({
        cycleType: 'FISCAL_YEAR',
        cycleLengthYears: 1,
        cycleStartMonth: 7 // July
      })
      const referenceDate = new Date('2024-09-15') // September

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2024)
      expect(start.getMonth()).toBe(6) // July
      expect(end.getFullYear()).toBe(2025)
      expect(end.getMonth()).toBe(5) // June (end of June)
    })

    it('should return previous fiscal year when in first half', () => {
      const rule = createMockRule({
        cycleType: 'FISCAL_YEAR',
        cycleLengthYears: 1,
        cycleStartMonth: 7 // July
      })
      const referenceDate = new Date('2024-03-15') // March

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2023)
      expect(start.getMonth()).toBe(6) // July 2023
      expect(end.getFullYear()).toBe(2024)
      expect(end.getMonth()).toBe(5) // June 2024
    })
  })

  describe('default/unknown cycle', () => {
    it('should default to calendar year for unknown cycle type', () => {
      const rule = createMockRule({ cycleType: 'UNKNOWN' as never, cycleLengthYears: 1 })
      const referenceDate = new Date('2024-06-15')

      const { start, end } = calculateCycleDates(rule, referenceDate)

      expect(start.getFullYear()).toBe(2024)
      expect(start.getMonth()).toBe(0)
      expect(end.getFullYear()).toBe(2024)
      expect(end.getMonth()).toBe(11)
    })
  })
})

// Test helper functions if they were exported
describe('Course Classification', () => {
  // These tests would require the helper functions to be exported
  // Currently they are internal to the module

  describe('Ethics course detection', () => {
    it.todo('should identify ethics courses correctly')
    it.todo('should identify professional responsibility courses')
    it.todo('should not flag non-ethics courses')
  })

  describe('Accounting/Auditing course detection', () => {
    it.todo('should identify A&A courses correctly')
    it.todo('should identify GAAP courses')
    it.todo('should identify attest courses')
  })

  describe('Tax course detection', () => {
    it.todo('should identify tax courses correctly')
    it.todo('should identify IRS courses')
  })
})
