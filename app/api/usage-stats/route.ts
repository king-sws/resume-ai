/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/usage-stats/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create usage stats
    let stats = await prisma.usageStats.findUnique({
      where: { userId: session.user.id },
    })

    // If no stats exist, create them based on user plan
    if (!stats) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true },
      })

      stats = await prisma.usageStats.create({
        data: {
          userId: session.user.id,
          resumesCreated: 0,
          resumesLimit: user?.plan === 'PRO' || user?.plan === 'ENTERPRISE' ? -1 : 1,
          aiCreditsUsed: 0,
          aiCreditsLimit: user?.plan === 'PRO' || user?.plan === 'ENTERPRISE' ? 100 : 10,
          premiumTemplatesUsed: false,
          totalViews: 0,
          totalDownloads: 0,
          lastResetAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      aiCreditsUsed: stats.aiCreditsUsed,
      aiCreditsLimit: stats.aiCreditsLimit,
      resumesCreated: stats.resumesCreated,
      resumesLimit: stats.resumesLimit,
      totalViews: stats.totalViews,
      totalDownloads: stats.totalDownloads,
      premiumTemplatesUsed: stats.premiumTemplatesUsed,
      lastResetAt: stats.lastResetAt,
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
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

    const body = await request.json()
    const { action } = body

    let updateData: any = {}

    switch (action) {
      case 'reset_monthly':
        // Reset monthly counters
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { plan: true },
        })

        updateData = {
          aiCreditsUsed: 0,
          aiCreditsLimit: user?.plan === 'PRO' || user?.plan === 'ENTERPRISE' ? 100 : 10,
          lastResetAt: new Date(),
        }
        break

      case 'increment_resume':
        updateData = {
          resumesCreated: { increment: 1 },
        }
        break

      case 'increment_ai_credit':
        updateData = {
          aiCreditsUsed: { increment: 1 },
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const stats = await prisma.usageStats.update({
      where: { userId: session.user.id },
      data: updateData,
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error updating usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to update usage stats' },
      { status: 500 }
    )
  }
}