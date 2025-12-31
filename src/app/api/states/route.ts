import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getOrCreateUserProfile } from '@/lib/auth'

// Valid US state codes (50 states + DC)
const VALID_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
  'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const

// Schema for state selection input validation
const statesInputSchema = z.object({
  states: z.array(
    z.string()
      .length(2, 'State code must be exactly 2 characters')
      .toUpperCase()
      .refine(
        (code) => VALID_STATE_CODES.includes(code as typeof VALID_STATE_CODES[number]),
        { message: 'Invalid state code' }
      )
  ).max(51, 'Cannot select more than 51 states'),
})

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
    const userProfile = await getOrCreateUserProfile()

    const body = await request.json()

    // Validate input with Zod schema
    const parseResult = statesInputSchema.safeParse(body)
    if (!parseResult.success) {
      const errors = parseResult.error.flatten()
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: errors.fieldErrors.states || errors.formErrors,
        },
        { status: 400 }
      )
    }

    const { states } = parseResult.data

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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update states' },
      { status: 500 }
    )
  }
}
