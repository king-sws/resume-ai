// app/api/templates/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const applyTemplateSchema = z.object({
  resumeId: z.string().cuid(),
  templateId: z.string().cuid(),
})

// GET handler for API route
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract query parameters from URL
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const premiumOnly = searchParams.get('premiumOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true }
    
    if (category && category !== 'ALL') {
      where.category = category
    }
    
    if (premiumOnly) {
      where.isPremium = true
    }

    // Fetch templates with pagination
    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { isPremium: 'asc' }, // Free first
        { usageCount: 'desc' },
      ],
      take: limit,
    })

    return NextResponse.json({ 
      templates,
      total: templates.length 
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// Apply template to a resume
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
    const { resumeId, templateId } = applyTemplateSchema.parse(body)

    // Check if template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template || !template.isActive) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
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

    // Verify resume ownership
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

    // Update resume with template
    const resume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        templateId: template.id,
      },
      include: {
        template: true
      }
    })

    // Increment template usage count
    await prisma.template.update({
      where: { id: template.id },
      data: {
        usageCount: { increment: 1 },
      },
    })

    return NextResponse.json({
      success: true,
      resume,
      message: `Template "${template.name}" applied successfully`
    })
  } catch (error) {
    console.error('Error applying template:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to apply template' },
      { status: 500 }
    )
  }
}