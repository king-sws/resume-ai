// app/api/applications/[id]/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const applicationSchema = z.object({
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  location: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal('')),
  salary: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
  priority: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  coverLetter: z.string().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email().optional().or(z.literal('')),
  source: z.string().optional(),
  screeningDate: z.string().nullable().optional(),
  interviewDate: z.string().nullable().optional(),
  deadlineDate: z.string().nullable().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
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

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // Verify ownership
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Update application
    const application = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...validatedData,
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
        eventType: 'application_updated',
        userId: session.user.id,
        metadata: {
          applicationId: id,
          status: validatedData.status,
        },
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error) {
    console.error('Error updating application:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Delete application
    await prisma.jobApplication.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}