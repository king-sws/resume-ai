// app/api/analytics/track/route.ts
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'

const trackEventSchema = z.object({
  eventType: z.string(),
  resumeId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    const headersList = await headers()

    const body = await request.json()
    const { eventType, resumeId, metadata } = trackEventSchema.parse(body)

    // Get IP and user agent
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    // Create analytics event
    await prisma.analytics.create({
      data: {
        eventType,
        userId: session?.user?.id,
        resumeId,
        metadata: metadata || {},
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
      },
    })

    // Update specific counters based on event type
    if (resumeId) {
      if (eventType === 'resume_viewed') {
        await prisma.resume.update({
          where: { id: resumeId },
          data: {
            viewCount: { increment: 1 },
            lastViewedAt: new Date(),
          },
        })
      } else if (eventType === 'resume_downloaded') {
        await prisma.resume.update({
          where: { id: resumeId },
          data: {
            downloadCount: { increment: 1 },
          },
        })
      } else if (eventType === 'resume_shared') {
        await prisma.resume.update({
          where: { id: resumeId },
          data: {
            shareCount: { increment: 1 },
          },
        })
      }

      // Update user usage stats
      if (session?.user?.id) {
        await prisma.usageStats.update({
          where: { userId: session.user.id },
          data: {
            totalViews: eventType === 'resume_viewed' ? { increment: 1 } : undefined,
            totalDownloads: eventType === 'resume_downloaded' ? { increment: 1 } : undefined,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    // Don't fail the request if tracking fails
    return NextResponse.json({ success: false }, { status: 200 })
  }
}

// Get analytics for a specific resume
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
    const resumeId = searchParams.get('resumeId')

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    })

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Get analytics events for this resume
    const events = await prisma.analytics.findMany({
      where: {
        resumeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    })

    // Group events by type
    const eventsByType = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get daily activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentEvents = events.filter(
      e => e.createdAt >= thirtyDaysAgo
    )

    const dailyActivity: Record<string, number> = {}
    recentEvents.forEach(event => {
      const date = event.createdAt.toISOString().split('T')[0]
      dailyActivity[date] = (dailyActivity[date] || 0) + 1
    })

    return NextResponse.json({
      summary: {
        totalEvents: events.length,
        views: resume.viewCount,
        downloads: resume.downloadCount,
        shares: resume.shareCount,
      },
      eventsByType,
      dailyActivity: Object.entries(dailyActivity).map(([date, count]) => ({
        date,
        count,
      })),
      recentEvents: events.slice(0, 20).map(e => ({
        type: e.eventType,
        timestamp: e.createdAt,
        metadata: e.metadata,
      })),
    })
  } catch (error) {
    console.error('Error fetching resume analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}