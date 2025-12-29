import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getOrCreateUserProfile } from '@/lib/auth'
import { deleteFile, BUCKETS } from '@/lib/s3'

export async function DELETE() {
  try {
    const userProfile = await getOrCreateUserProfile()

    // Get all documents to delete from S3
    const documents = await db.document.findMany({
      where: { userId: userProfile.id },
      select: { storageKey: true },
    })

    // Delete all course records
    await db.courseRecord.deleteMany({
      where: { userId: userProfile.id },
    })

    // Delete all documents from database
    await db.document.deleteMany({
      where: { userId: userProfile.id },
    })

    // Delete all exports
    await db.export.deleteMany({
      where: { userId: userProfile.id },
    })

    // Reset user profile selected states
    await db.userProfile.update({
      where: { id: userProfile.id },
      data: { selectedStates: [] },
    })

    // Delete files from S3 in parallel (best effort, non-blocking)
    await Promise.allSettled(
      documents.map(async (doc) => {
        try {
          await deleteFile(BUCKETS.documents, doc.storageKey)
        } catch (s3Error) {
          console.error('Failed to delete S3 file:', doc.storageKey, s3Error)
        }
      })
    )

    return NextResponse.json({
      success: true,
      message: 'All user data deleted successfully',
    })
  } catch (error) {
    console.error('Delete user data error:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete user data' },
      { status: 500 }
    )
  }
}
