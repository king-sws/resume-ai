/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnalyticsEvent } from '@/hooks/useAnalytics'

// lib/analytics.ts - Server-side analytics utilities
export async function trackServerEvent(
  eventType: AnalyticsEvent,
  userId: string,
  resumeId?: string,
  metadata?: Record<string, any>
) {
  try {
    const { default: prisma } = await import('@/lib/db')
    
    await prisma.analytics.create({
      data: {
        eventType,
        userId,
        resumeId,
        metadata: metadata || {},
      },
    })
  } catch (error) {
    console.error('Server analytics error:', error)
  }
}

export async function getResumeAnalytics(resumeId: string, userId: string) {
  try {
    const { default: prisma } = await import('@/lib/db')
    
    // Verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
    })

    if (!resume) {
      throw new Error('Resume not found')
    }

    // Get events for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const events = await prisma.analytics.findMany({
      where: {
        resumeId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate metrics
    const dailyViews: Record<string, number> = {}
    const eventCounts: Record<string, number> = {}

    events.forEach((event) => {
      const date = event.createdAt.toISOString().split('T')[0]
      dailyViews[date] = (dailyViews[date] || 0) + 1
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1
    })

    return {
      summary: {
        totalViews: resume.viewCount,
        totalDownloads: resume.downloadCount,
        totalShares: resume.shareCount,
        lastViewed: resume.lastViewedAt,
      },
      recent: {
        events: events.slice(0, 10),
        dailyViews: Object.entries(dailyViews).map(([date, count]) => ({
          date,
          count,
        })),
      },
      breakdown: eventCounts,
    }
  } catch (error) {
    console.error('Error getting resume analytics:', error)
    return null
  }
}