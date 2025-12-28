import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calculateUserCompliance } from '@/lib/rules-engine'
import { getOrCreateUserProfile } from '@/lib/auth'

export async function GET() {
  try {
    const userProfile = await getOrCreateUserProfile()

    const selectedStates = userProfile.selectedStates

    if (selectedStates.length === 0) {
      return NextResponse.json({
        success: true,
        data: { states: [], totalCourses: 0, needsReviewCount: 0 },
      })
    }

    // Calculate compliance using the rules engine
    const complianceStates = await calculateUserCompliance(
      userProfile.id,
      selectedStates
    )

    // Get course stats
    const courses = await db.courseRecord.findMany({
      where: {
        userId: userProfile.id,
        isDuplicate: false,
      },
      select: { needsReview: true },
    })

    const needsReviewCount = courses.filter((c) => c.needsReview).length

    return NextResponse.json({
      success: true,
      data: {
        states: complianceStates,
        totalCourses: courses.length,
        needsReviewCount,
      },
    })
  } catch (error) {
    console.error('Get compliance error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate compliance' },
      { status: 500 }
    )
  }
}
