// app/api/admin/templates/[id]/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(['MODERN', 'CLASSIC', 'CREATIVE', 'MINIMALIST', 'PROFESSIONAL', 'TECHNICAL']).optional(),
  thumbnail: z.string().optional(),
  previewUrl: z.string().optional(),
  isPremium: z.boolean().optional(),
  isActive: z.boolean().optional(),
  structure: z.any().optional(),
})

async function checkAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === 'ADMIN'
}

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

    const isAdmin = await checkAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { id } = await params

    const template = await prisma.template.findUnique({
      where: { id },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
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

    const isAdmin = await checkAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    const template = await prisma.template.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error('Error updating template:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const isAdmin = await checkAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const template = await prisma.template.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
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

    const isAdmin = await checkAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { id } = await params

    await prisma.template.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}