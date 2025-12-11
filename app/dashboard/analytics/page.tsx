/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/analytics/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { AnalyticsClient } from '@/components/analytics/AnalyticsClient'

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch data server-side
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30) // Last 30 days

  const [resumes, aiInteractions, jobApplications, usageStats] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        downloadCount: true,
        shareCount: true,
        aiScore: true,
        createdAt: true,
        updatedAt: true,
        lastViewedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.aIInteraction.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: startDate },
      },
      select: {
        type: true,
        wasSuccessful: true,
        tokensUsed: true,
        createdAt: true,
      },
    }),
    prisma.jobApplication.findMany({
      where: {
        userId: session.user.id,
        createdAt: { gte: startDate },
      },
      select: {
        status: true,
        createdAt: true,
        appliedAt: true,
      },
    }),
    prisma.usageStats.findUnique({
      where: { userId: session.user.id },
    }),
  ])

  // Calculate analytics
  const totalViews = resumes.reduce((sum, r) => sum + r.viewCount, 0)
  const totalDownloads = resumes.reduce((sum, r) => sum + r.downloadCount, 0)
  const totalShares = resumes.reduce((sum, r) => sum + r.shareCount, 0)
  const averageScore = resumes.length > 0 
    ? resumes.reduce((sum, r) => sum + (r.aiScore || 0), 0) / resumes.length 
    : 0

  // AI usage by type
  const aiUsageByType = aiInteractions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Job application funnel
  const applicationFunnel = jobApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Activity over time
  const dailyActivity: Record<string, any> = {}
  
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    
    dailyActivity[dateKey] = {
      date: dateKey,
      aiInteractions: 0,
      applications: 0,
    }
  }

  aiInteractions.forEach(interaction => {
    const dateKey = interaction.createdAt.toISOString().split('T')[0]
    if (dailyActivity[dateKey]) {
      dailyActivity[dateKey].aiInteractions++
    }
  })

  jobApplications.forEach(app => {
    const dateKey = app.createdAt.toISOString().split('T')[0]
    if (dailyActivity[dateKey]) {
      dailyActivity[dateKey].applications++
    }
  })

  // Top resumes
  const topResumes = [...resumes]
    .sort((a, b) => (b.viewCount + b.downloadCount) - (a.viewCount + a.downloadCount))
    .slice(0, 5)
    .map(r => ({
      id: r.id,
      title: r.title,
      totalEngagement: r.viewCount + r.downloadCount + r.shareCount,
      views: r.viewCount,
      downloads: r.downloadCount,
      shares: r.shareCount,
      score: r.aiScore,
    }))

  const analyticsData = {
    summary: {
      totalResumes: resumes.length,
      activeResumes: resumes.filter(r => r.status === 'ACTIVE').length,
      draftResumes: resumes.filter(r => r.status === 'DRAFT').length,
      totalViews,
      totalDownloads,
      totalShares,
      averageScore: Math.round(averageScore),
      totalApplications: jobApplications.length,
    },
    usage: {
      aiCreditsUsed: usageStats?.aiCreditsUsed || 0,
      aiCreditsLimit: usageStats?.aiCreditsLimit || 10,
      resumesCreated: usageStats?.resumesCreated || 0,
      resumesLimit: usageStats?.resumesLimit || 1,
    },
    aiUsage: {
      byType: aiUsageByType,
      totalInteractions: aiInteractions.length,
      successRate: aiInteractions.length > 0
        ? (aiInteractions.filter(i => i.wasSuccessful).length / aiInteractions.length) * 100
        : 0,
      totalTokens: aiInteractions.reduce((sum, i) => sum + (i.tokensUsed || 0), 0),
    },
    applications: {
      total: jobApplications.length,
      funnel: applicationFunnel,
      byStatus: Object.entries(applicationFunnel).map(([status, count]) => ({
        status,
        count,
        percentage: (count / jobApplications.length) * 100,
      })),
    },
    activity: Object.values(dailyActivity).reverse(),
    topResumes,
  }

  return <AnalyticsClient data={analyticsData} />
}