// app/api/admin/templates/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['MODERN', 'CLASSIC', 'CREATIVE', 'MINIMALIST', 'PROFESSIONAL', 'TECHNICAL']),
  thumbnail: z.string().optional(),
  previewUrl: z.string().optional(),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true),
  structure: z.any(),
})

async function checkAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === 'ADMIN'
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin role
    const isAdmin = await checkAdmin(session.user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = templateSchema.parse(body)

    const template = await prisma.template.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        thumbnail: validatedData.thumbnail,
        previewUrl: validatedData.previewUrl,
        isPremium: validatedData.isPremium,
        isActive: validatedData.isActive,
        structure: validatedData.structure,
      },
    })

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error('Error creating template:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

export async function GET() {
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

    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}