import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const states = await db.stateRule.findMany({
      orderBy: { stateName: 'asc' },
      select: {
        stateCode: true,
        stateName: true,
        totalHoursRequired: true,
        ethicsHoursRequired: true,
        cycleType: true,
        cycleLengthYears: true,
        boardName: true,
        boardUrl: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: { states },
    })
  } catch (error) {
    console.error('Get states error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}

// Update user's selected states
export async function PUT(request: NextRequest) {
  try {
    // TODO: Get user from Clerk auth
    const userId = request.headers.get('x-user-id') || 'demo-user'

    const userProfile = await db.userProfile.findUnique({
      where: { clerkUserId: userId },
    })

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const { states } = await request.json()

    if (!Array.isArray(states)) {
      return NextResponse.json(
        { success: false, error: 'Invalid states format' },
        { status: 400 }
      )
    }

    const updatedUser = await db.userProfile.update({
      where: { id: userProfile.id },
      data: { selectedStates: states },
    })

    return NextResponse.json({
      success: true,
      data: { selectedStates: updatedUser.selectedStates },
    })
  } catch (error) {
    console.error('Update states error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update states' },
      { status: 500 }
    )
  }
}
