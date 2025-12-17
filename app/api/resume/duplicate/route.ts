// ========================================
// app/api/resume/duplicate/route.ts
// ========================================
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@/lib/generated/prisma/client'

const duplicateSchema = z.object({
  resumeId: z.string().cuid(),
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
    const { resumeId } = duplicateSchema.parse(body)

    // Fetch original resume
    const original = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    })

    if (!original) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Check user's resume limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usageStats: true },
    })

    const resumeCount = await prisma.resume.count({
      where: { userId: session.user.id },
    })

    const limit = user?.usageStats?.resumesLimit || 1
    if (user?.plan === 'FREE' && limit !== -1 && resumeCount >= limit) {
      return NextResponse.json(
        { 
          error: 'Resume limit reached', 
          message: 'Upgrade to Pro to create unlimited resumes' 
        },
        { status: 403 }
      )
    }

    // Create duplicate - cast data to InputJsonValue
    const duplicate = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: `${original.title} (Copy)`,
        description: original.description,
        data: original.data as Prisma.InputJsonValue,
        status: 'DRAFT',
        templateId: original.templateId,
      },
    })

    return NextResponse.json({
      success: true,
      resume: duplicate,
    })
  } catch (error) {
    console.error('Error duplicating resume:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to duplicate resume' },
      { status: 500 }
    )
  }
}
