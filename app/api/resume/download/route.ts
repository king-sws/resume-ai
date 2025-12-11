// app/api/resume/download/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const downloadSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required'),
})

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate request
    const validation = downloadSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { resumeId } = validation.data

    // Verify resume ownership
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

    // Update download count
    const updatedResume = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        downloadCount: { increment: 1 },
      },
      select: {
        id: true,
        downloadCount: true,
      }
    })

    return NextResponse.json({
      success: true,
      downloadCount: updatedResume.downloadCount,
    })

  } catch (error) {
    console.error('Error tracking download:', error)
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string }
      
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to track download',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}