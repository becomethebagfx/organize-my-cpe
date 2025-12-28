import OpenAI from 'openai'
// @ts-expect-error - pdf-parse types are incomplete
import pdf from 'pdf-parse'
import * as XLSX from 'xlsx'
import { extractedCourseSchema, type ExtractedCourse } from '@/types'
import crypto from 'crypto'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Extract text from PDF buffer
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

// Parse CSV content
export function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const row: Record<string, string> = {}
      headers.forEach((header, idx) => {
        row[header] = values[idx]
      })
      rows.push(row)
    }
  }

  return rows
}

// Helper to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  values.push(current.trim())

  return values.map(v => v.replace(/^["']|["']$/g, ''))
}

// Parse XLSX content
export function parseXlsx(buffer: Buffer): Record<string, string>[][] {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheets: Record<string, string>[][] = []

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
      raw: false,
      defval: '',
    })
    sheets.push(jsonData)
  }

  return sheets
}

// Use LLM to normalize certificate text into structured data
export async function normalizeCertificateText(text: string): Promise<ExtractedCourse> {
  const prompt = `Extract CPE course information from this certificate text. Return valid JSON with these fields:
- providerName: string or null (the organization that provided the CPE)
- courseTitle: string or null (the name of the course)
- completionDate: string or null (ISO date format YYYY-MM-DD)
- deliveryMethod: "SELF_STUDY" | "LIVE" | "WEBINAR" | "HYBRID" | "UNKNOWN" or null
- fieldOfStudy: string or null (e.g., "Ethics", "Accounting", "Auditing", "Taxation")
- credits: number or null (CPE hours earned)
- sponsorId: string or null (NASBA sponsor ID if present)
- certificateNumber: string or null
- confidence: number between 0 and 1 (your confidence in the extraction)

Certificate text:
${text.slice(0, 4000)}

Return ONLY valid JSON, no explanation.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from LLM')
    }

    const parsed = JSON.parse(content)
    const validated = extractedCourseSchema.parse(parsed)
    return validated
  } catch (error) {
    console.error('LLM normalization error:', error)
    // Return a low-confidence result that needs review
    return {
      providerName: null,
      courseTitle: null,
      completionDate: null,
      deliveryMethod: null,
      fieldOfStudy: null,
      credits: null,
      sponsorId: null,
      certificateNumber: null,
      confidence: 0,
    }
  }
}

// Map spreadsheet row to course data using column detection
export function mapSpreadsheetRow(row: Record<string, string>): Partial<ExtractedCourse> {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')

  const columnMappings: Record<string, keyof ExtractedCourse> = {
    provider: 'providerName',
    sponsor: 'providerName',
    company: 'providerName',
    coursename: 'courseTitle',
    coursetitle: 'courseTitle',
    title: 'courseTitle',
    course: 'courseTitle',
    date: 'completionDate',
    completiondate: 'completionDate',
    dateofcompletion: 'completionDate',
    completed: 'completionDate',
    credits: 'credits',
    cpehours: 'credits',
    hours: 'credits',
    cpe: 'credits',
    method: 'deliveryMethod',
    deliverymethod: 'deliveryMethod',
    type: 'deliveryMethod',
    format: 'deliveryMethod',
    fieldofstudy: 'fieldOfStudy',
    subject: 'fieldOfStudy',
    subjectarea: 'fieldOfStudy',
    category: 'fieldOfStudy',
    sponsorid: 'sponsorId',
    nasbaid: 'sponsorId',
    certificatenumber: 'certificateNumber',
    certnumber: 'certificateNumber',
    certificateid: 'certificateNumber',
  }

  const result: Partial<ExtractedCourse> = {
    confidence: 0.9, // Spreadsheet data is generally reliable
  }

  for (const [column, value] of Object.entries(row)) {
    const normalizedColumn = normalize(column)
    const mappedField = columnMappings[normalizedColumn]

    if (mappedField && value) {
      if (mappedField === 'credits') {
        const num = parseFloat(value.replace(/[^0-9.]/g, ''))
        if (!isNaN(num)) {
          result.credits = num
        }
      } else if (mappedField === 'deliveryMethod') {
        result.deliveryMethod = mapDeliveryMethod(value)
      } else if (mappedField === 'completionDate') {
        const date = parseDate(value)
        if (date) {
          result.completionDate = date
        }
      } else {
        (result as Record<string, unknown>)[mappedField] = value
      }
    }
  }

  return result
}

// Map delivery method strings to enum values
function mapDeliveryMethod(value: string): ExtractedCourse['deliveryMethod'] {
  const lower = value.toLowerCase()
  if (lower.includes('self') || lower.includes('online') || lower.includes('on-demand')) {
    return 'SELF_STUDY'
  }
  if (lower.includes('live') || lower.includes('instructor') || lower.includes('in-person')) {
    return 'LIVE'
  }
  if (lower.includes('webinar') || lower.includes('webcast')) {
    return 'WEBINAR'
  }
  if (lower.includes('hybrid') || lower.includes('blended')) {
    return 'HYBRID'
  }
  return 'UNKNOWN'
}

// Parse various date formats
function parseDate(value: string): string | null {
  try {
    // Try parsing common formats
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }

    // Try MM/DD/YYYY
    const mdyMatch = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/)
    if (mdyMatch) {
      let year = parseInt(mdyMatch[3])
      if (year < 100) year += 2000
      const month = parseInt(mdyMatch[1])
      const day = parseInt(mdyMatch[2])
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    return null
  } catch {
    return null
  }
}

// Generate fingerprint for deduplication
export function generateFingerprint(course: {
  courseTitle: string
  completionDate: Date | string
  credits: number | string
}): string {
  const normalized = [
    course.courseTitle.toLowerCase().replace(/\s+/g, ''),
    new Date(course.completionDate).toISOString().split('T')[0],
    parseFloat(String(course.credits)).toFixed(1),
  ].join('|')

  return crypto.createHash('md5').update(normalized).digest('hex')
}
