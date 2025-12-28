import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courseRecordSchema } from '@/types'
import { getOrCreateUserProfile } from '@/lib/auth'

export async function GET() {
  try {
    const userProfile = await getOrCreateUserProfile()

    const courses = await db.courseRecord.findMany({
      where: {
        userId: userProfile.id,
        isDuplicate: false,
      },
      orderBy: { completionDate: 'desc' },
      include: {
        document: {
          select: { originalName: true },
        },
      },
    })

    const needsReviewCount = courses.filter((c) => c.needsReview).length

    return NextResponse.json({
      success: true,
      data: {
        courses: courses.map((c) => ({
          ...c,
          credits: Number(c.credits),
          documentName: c.document?.originalName,
        })),
        total: courses.length,
        needsReview: needsReviewCount,
      },
    })
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userProfile = await getOrCreateUserProfile()

    const body = await request.json()
    const validatedData = courseRecordSchema.parse(body)

    const course = await db.courseRecord.create({
      data: {
        userId: userProfile.id,
        ...validatedData,
        credits: validatedData.credits,
        needsReview: false,
        confidence: 1.0,
      },
    })

    return NextResponse.json({
      success: true,
      data: { course: { ...course, credits: Number(course.credits) } },
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
