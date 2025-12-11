/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/resume/save/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Detailed validation schema for resume data
const resumeDataSchema = z.object({
  title: z.string().min(1),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string().optional(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  skills: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
})

const saveResumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  data: resumeDataSchema,
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional().default('DRAFT'),
  resumeId: z.string().optional(),
  templateId: z.string().optional(), // Add template ID
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
    
    // Validate request data
    const validation = saveResumeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { title, data, status, resumeId, templateId } = validation.data

    // If template ID is provided, validate it
    if (templateId) {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      })

      if (!template || !template.isActive) {
        return NextResponse.json(
          { error: 'Invalid template' },
          { status: 400 }
        )
      }

      // Check if user can use premium template
      if (template.isPremium) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { plan: true },
        })

        if (user?.plan === 'FREE') {
          return NextResponse.json(
            { 
              error: 'Premium template', 
              message: 'Upgrade to Pro to use premium templates' 
            },
            { status: 403 }
          )
        }
      }
    }

    // If updating existing resume
    if (resumeId) {
      const existingResume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id,
        },
      })

      if (!existingResume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        )
      }

      const updatedResume = await prisma.resume.update({
        where: { id: resumeId },
        data: {
          title,
          data: data as any,
          status,
          ...(templateId && { templateId }), // Update template if provided
          updatedAt: new Date(),
        },
        include: {
          template: true // Include template in response
        }
      })

      return NextResponse.json({
        success: true,
        resume: updatedResume,
      })
    }

    // Creating new resume - check limits first
    const [user, resumeCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: { usageStats: true },
      }),
      prisma.resume.count({
        where: { userId: session.user.id },
      })
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const limit = user.usageStats?.resumesLimit || 1
    
    // Check if user has reached their limit
    if (user.plan === 'FREE' && limit !== -1 && resumeCount >= limit) {
      return NextResponse.json(
        { 
          error: 'Resume limit reached', 
          message: 'Upgrade to Pro to create unlimited resumes',
          limit,
          current: resumeCount
        },
        { status: 403 }
      )
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create new resume
      const newResume = await tx.resume.create({
        data: {
          userId: session.user.id,
          title,
          data: data as any,
          status,
          ...(templateId && { templateId }), // Connect template if provided
        },
        include: {
          template: true // Include template in response
        }
      })

      // Update or create usage stats
      await tx.usageStats.upsert({
        where: { userId: session.user.id },
        update: {
          resumesCreated: { increment: 1 },
        },
        create: {
          userId: session.user.id,
          resumesCreated: 1,
          resumesLimit: user.plan === 'PRO' ? -1 : 1,
          aiCreditsUsed: 0,
          aiCreditsLimit: user.plan === 'PRO' ? 100 : 10,
        },
      })

      // If template was used, increment its usage count
      if (templateId) {
        await tx.template.update({
          where: { id: templateId },
          data: {
            usageCount: { increment: 1 },
          },
        })
      }

      return newResume
    })

    return NextResponse.json({
      success: true,
      resume: result,
    })

  } catch (error) {
    console.error('Error saving resume:', error)
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: any }
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'A resume with this information already exists' },
          { status: 409 }
        )
      }
      
      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          { error: 'Invalid reference in resume data' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to save resume',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}