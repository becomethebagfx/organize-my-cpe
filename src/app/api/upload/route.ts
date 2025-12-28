import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { uploadFile, BUCKETS } from '@/lib/s3'
import { v4 as uuidv4 } from 'uuid'
import { getOrCreateUserProfile } from '@/lib/auth'

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

      // TODO: Queue extraction job
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
