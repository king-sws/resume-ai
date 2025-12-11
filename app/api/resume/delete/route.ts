// app/api/resume/delete/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const deleteSchema = z.object({
  resumeId: z.string().cuid(),
})

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { resumeId } = deleteSchema.parse(body)

    // Check if resume exists and belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Delete resume (cascade will handle related records)
    await prisma.resume.delete({
      where: { id: resumeId },
    })

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting resume:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    )
  }
}