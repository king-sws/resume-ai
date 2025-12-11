// app/api/applications/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const applicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal('')),
  salary: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
  priority: z.number().min(1).max(5),
  resumeId: z.string().min(1, 'Resume is required'),
  notes: z.string().optional(),
  coverLetter: z.string().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email().optional().or(z.literal('')),
  source: z.string().optional(),
  screeningDate: z.string().nullable().optional(),
  interviewDate: z.string().nullable().optional(),
  deadlineDate: z.string().nullable().optional(),
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
    const validatedData = applicationSchema.parse(body)

    // Verify resume belongs to user
    const resume = await prisma.resume.findFirst({
      where: {
        id: validatedData.resumeId,
        userId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        company: validatedData.company,
        position: validatedData.position,
        location: validatedData.location || null,
        jobUrl: validatedData.jobUrl || null,
        salary: validatedData.salary || null,
        status: validatedData.status,
        priority: validatedData.priority,
        resumeId: validatedData.resumeId,
        notes: validatedData.notes || null,
        coverLetter: validatedData.coverLetter || null,
        recruiterName: validatedData.recruiterName || null,
        recruiterEmail: validatedData.recruiterEmail || null,
        source: validatedData.source || null,
        screeningDate: validatedData.screeningDate ? new Date(validatedData.screeningDate) : null,
        interviewDate: validatedData.interviewDate ? new Date(validatedData.interviewDate) : null,
        deadlineDate: validatedData.deadlineDate ? new Date(validatedData.deadlineDate) : null,
      },
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Track analytics event
    await prisma.analytics.create({
      data: {
        eventType: 'application_created',
        userId: session.user.id,
        metadata: {
          company: validatedData.company,
          position: validatedData.position,
          status: validatedData.status,
        },
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error('Error creating application:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: session.user.id }
    
    if (status) {
      where.status = status
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { priority: 'asc' },
        { appliedAt: 'desc' },
      ],
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}