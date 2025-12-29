import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  generateCanonicalExport,
  generateStateExport,
  generateComplianceSummary,
} from '@/lib/export-generator'
import { getOrCreateUserProfile } from '@/lib/auth'
import { ExportType } from '@prisma/client'

// Valid export types from Prisma enum
const VALID_EXPORT_TYPES: Set<string> = new Set([
  'STATE_CSV',
  'STATE_XLSX',
  'CANONICAL_CSV',
  'CANONICAL_XLSX',
  'CERTIFICATE_ZIP',
  'SUMMARY_PDF',
])

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params
    const userProfile = await getOrCreateUserProfile()

    const exportType = type.toUpperCase()

    // Validate export type before processing
    if (!VALID_EXPORT_TYPES.has(exportType)) {
      return NextResponse.json(
        { success: false, error: `Invalid export type: ${type}. Valid types: ${Array.from(VALID_EXPORT_TYPES).join(', ')}` },
        { status: 400 }
      )
    }

    // Parse optional state code from query params
    const url = new URL(request.url)
    const stateCode = url.searchParams.get('state')

    let result

    switch (exportType) {
      case 'CANONICAL_CSV':
        result = await generateCanonicalExport({
          userId: userProfile.id,
          format: 'csv',
        })
        break

      case 'CANONICAL_XLSX':
        result = await generateCanonicalExport({
          userId: userProfile.id,
          format: 'xlsx',
        })
        break

      case 'STATE_CSV':
        if (!stateCode) {
          return NextResponse.json(
            { success: false, error: 'State code required' },
            { status: 400 }
          )
        }
        result = await generateStateExport({
          userId: userProfile.id,
          stateCode,
          format: 'csv',
        })
        if (!result) {
          return NextResponse.json(
            { success: false, error: 'State not found' },
            { status: 404 }
          )
        }
        break

      case 'STATE_XLSX':
        if (!stateCode) {
          return NextResponse.json(
            { success: false, error: 'State code required' },
            { status: 400 }
          )
        }
        result = await generateStateExport({
          userId: userProfile.id,
          stateCode,
          format: 'xlsx',
        })
        if (!result) {
          return NextResponse.json(
            { success: false, error: 'State not found' },
            { status: 404 }
          )
        }
        break

      case 'SUMMARY_PDF':
        result = await generateComplianceSummary(userProfile.id)
        break

      case 'CERTIFICATE_ZIP':
        return NextResponse.json(
          { success: false, error: 'Certificate ZIP export not yet implemented' },
          { status: 501 }
        )

      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported export type' },
          { status: 400 }
        )
    }

    // Save export record (exportType is already validated)
    await db.export.create({
      data: {
        userId: userProfile.id,
        stateCode,
        exportType: exportType as ExportType,
        filename: result.filename,
        storageKey: `exports/${userProfile.id}/${result.filename}`,
      },
    })

    return new NextResponse(new Uint8Array(result.data), {
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    )
  }
}
