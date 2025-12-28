import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courseRecordSchema } from '@/types'
import { getOrCreateUserProfile } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userProfile = await getOrCreateUserProfile()

    const course = await db.courseRecord.findFirst({
      where: {
        id,
        userId: userProfile.id,
      },
      include: {
        document: {
          select: { originalName: true, storageKey: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { course: { ...course, credits: Number(course.credits) } },
    })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userProfile = await getOrCreateUserProfile()

    // Verify ownership
    const existing = await db.courseRecord.findFirst({
      where: { id, userId: userProfile.id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = courseRecordSchema.partial().parse(body)

    const course = await db.courseRecord.update({
      where: { id },
      data: {
        ...validatedData,
        needsReview: false, // Clear review flag on edit
      },
    })

    return NextResponse.json({
      success: true,
      data: { course: { ...course, credits: Number(course.credits) } },
    })
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userProfile = await getOrCreateUserProfile()

    // Verify ownership
    const existing = await db.courseRecord.findFirst({
      where: { id, userId: userProfile.id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    await db.courseRecord.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}
