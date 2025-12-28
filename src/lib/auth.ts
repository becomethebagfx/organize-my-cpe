import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import type { UserProfile } from '@prisma/client'

/**
 * Get the current authenticated user's Clerk ID
 * Returns null if not authenticated
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

/**
 * Get or create the UserProfile for the current authenticated user
 * Throws if not authenticated
 */
export async function getOrCreateUserProfile(): Promise<UserProfile> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  // Try to find existing profile
  let userProfile = await db.userProfile.findUnique({
    where: { clerkUserId: userId },
  })

  // If not found, create one using Clerk user data
  if (!userProfile) {
    const clerkUser = await currentUser()
    const email = clerkUser?.emailAddresses[0]?.emailAddress || ''

    userProfile = await db.userProfile.create({
      data: {
        clerkUserId: userId,
        email,
        tier: 'FREE',
        selectedStates: [],
      },
    })
  }

  return userProfile
}

/**
 * Require authentication and return the user profile
 * For use in API routes
 */
export async function requireAuth(): Promise<UserProfile> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const userProfile = await db.userProfile.findUnique({
    where: { clerkUserId: userId },
  })

  if (!userProfile) {
    throw new Error('User profile not found')
  }

  return userProfile
}
