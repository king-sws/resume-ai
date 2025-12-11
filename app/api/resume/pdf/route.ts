// app/api/resume/pdf/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const pdfSchema = z.object({
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
    const { resumeId } = pdfSchema.parse(body)

    // Fetch resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
      include: {
        template: true
      }
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Return resume data for client-side PDF generation
    // The QuickPDFGenerator component handles the actual PDF creation
    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        title: resume.title,
        data: resume.data,
        template: resume.template
      }
    })
  } catch (error) {
    console.error('PDF API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch resume for PDF' },
      { status: 500 }
    )
  }
}