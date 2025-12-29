import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { uploadFile, BUCKETS } from '@/lib/s3'
import { v4 as uuidv4 } from 'uuid'
import { getOrCreateUserProfile } from '@/lib/auth'
import {
  extractPdfText,
  parseCsv,
  parseXlsx,
  normalizeCertificateText,
  mapSpreadsheetRow,
  generateFingerprint,
} from '@/lib/extraction'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
]

export async function POST(request: NextRequest) {
  try {
    const userProfile = await getOrCreateUserProfile()

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedDocs = []

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        continue // Skip invalid files
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        continue // Skip oversized files
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const fileId = uuidv4()
      const ext = file.name.split('.').pop() || 'bin'
      const storageKey = `${userProfile.id}/${fileId}.${ext}`

      // Upload to S3
      await uploadFile(BUCKETS.documents, storageKey, buffer, file.type)

      // Create document record
      const doc = await db.document.create({
        data: {
          userId: userProfile.id,
          filename: `${fileId}.${ext}`,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          storageKey,
          status: 'PENDING',
        },
      })

      uploadedDocs.push({
        id: doc.id,
        filename: doc.originalName,
        status: doc.status,
      })

      // Process extraction inline (no queue for simplicity)
      try {
        const extractedCourses: Array<{
          courseTitle: string
          providerName: string | null
          credits: number
          completionDate: Date
          fieldOfStudy: string | null
          deliveryMethod: string | null
          confidence: number
        }> = []

        if (file.type === 'application/pdf') {
          // Extract text from PDF and use AI to normalize
          const pdfText = await extractPdfText(buffer)
          const extracted = await normalizeCertificateText(pdfText)

          if (extracted.courseTitle && extracted.credits && extracted.completionDate) {
            extractedCourses.push({
              courseTitle: extracted.courseTitle,
              providerName: extracted.providerName,
              credits: extracted.credits,
              completionDate: new Date(extracted.completionDate),
              fieldOfStudy: extracted.fieldOfStudy,
              deliveryMethod: extracted.deliveryMethod,
              confidence: extracted.confidence,
            })
          }
        } else if (file.type === 'text/csv') {
          // Parse CSV rows
          const content = buffer.toString('utf-8')
          const rows = parseCsv(content)
          for (const row of rows) {
            const mapped = mapSpreadsheetRow(row)
            if (mapped.courseTitle && mapped.credits && mapped.completionDate) {
              extractedCourses.push({
                courseTitle: mapped.courseTitle,
                providerName: mapped.providerName || null,
                credits: mapped.credits,
                completionDate: new Date(mapped.completionDate),
                fieldOfStudy: mapped.fieldOfStudy || null,
                deliveryMethod: mapped.deliveryMethod || null,
                confidence: mapped.confidence || 0.9,
              })
            }
          }
        } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
          // Parse XLSX sheets
          const sheets = parseXlsx(buffer)
          for (const rows of sheets) {
            for (const row of rows) {
              const mapped = mapSpreadsheetRow(row)
              if (mapped.courseTitle && mapped.credits && mapped.completionDate) {
                extractedCourses.push({
                  courseTitle: mapped.courseTitle,
                  providerName: mapped.providerName || null,
                  credits: mapped.credits,
                  completionDate: new Date(mapped.completionDate),
                  fieldOfStudy: mapped.fieldOfStudy || null,
                  deliveryMethod: mapped.deliveryMethod || null,
                  confidence: mapped.confidence || 0.9,
                })
              }
            }
          }
        }

        // Create course records for each extracted course
        for (const course of extractedCourses) {
          const fingerprint = generateFingerprint({
            courseTitle: course.courseTitle,
            completionDate: course.completionDate,
            credits: course.credits,
          })

          // Check for duplicates
          const existing = await db.courseRecord.findFirst({
            where: { userId: userProfile.id, fingerprint },
          })

          if (!existing) {
            await db.courseRecord.create({
              data: {
                userId: userProfile.id,
                documentId: doc.id,
                courseTitle: course.courseTitle,
                providerName: course.providerName,
                credits: course.credits,
                completionDate: course.completionDate,
                fieldOfStudy: course.fieldOfStudy,
                deliveryMethod: (course.deliveryMethod || 'UNKNOWN') as 'SELF_STUDY' | 'LIVE' | 'WEBINAR' | 'HYBRID' | 'UNKNOWN',
                fingerprint,
                confidence: course.confidence,
                needsReview: course.confidence < 0.7,
              },
            })
          }
        }

        // Update document status to completed (extraction ran, may or may not have found data)
        await db.document.update({
          where: { id: doc.id },
          data: { status: 'COMPLETED' },
        })
      } catch (extractError) {
        console.error('Extraction error for document:', doc.id, extractError)
        await db.document.update({
          where: { id: doc.id },
          data: { status: 'FAILED' },
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: { documents: uploadedDocs },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}
