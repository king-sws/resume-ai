// app/api/user/profile/route.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  image: z.string().optional().nullable(), // Accept base64 data URL
})

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const { default: prisma } = await import('@/lib/db')
    
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        image: validatedData.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        plan: true,
      },
    })

    // Log analytics
    await prisma.analytics.create({
      data: {
        eventType: 'profile_updated',
        userId: session.user.id,
        metadata: { fields: Object.keys(validatedData) },
      },
    }).catch(() => {
      // Silently fail if analytics doesn't work
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
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

    const { default: prisma } = await import('@/lib/db')
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        plan: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}