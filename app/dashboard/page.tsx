// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Sparkles, 
  Eye,
  Download,
  Briefcase,
  Award,
  Brain,
  Edit3,
  Zap,
  ArrowRight,
  Clock,
  Star,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { UsageStatsWidget } from '@/components/dashboard/UsageStatsWidget'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch user with usage stats
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      usageStats: true,
    },
  })

  // Fetch recent resumes
  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 5,
    include: {
      template: {
        select: {
          name: true,
          thumbnail: true,
        },
      },
    },
  })

  // Get quick stats with trends
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    totalViews, 
    totalDownloads, 
    applicationCount,
    avgScore,
    lastWeekViews,
    previousWeekViews,
    lastWeekDownloads,
    previousWeekDownloads,
    lastWeekApplications,
    previousWeekApplications
  ] = await Promise.all([
    // Total stats
    prisma.resume.aggregate({
      where: { userId: session.user.id },
      _sum: { viewCount: true },
    }).then(r => r._sum.viewCount || 0),
    prisma.resume.aggregate({
      where: { userId: session.user.id },
      _sum: { downloadCount: true },
    }).then(r => r._sum.downloadCount || 0),
    prisma.jobApplication.count({
      where: { userId: session.user.id },
    }),
    prisma.resume.aggregate({
      where: { 
        userId: session.user.id,
        aiScore: { not: null },
      },
      _avg: { aiScore: true },
    }).then(r => r._avg.aiScore || 0),
    
    // Last week trends (simplified - you'd need actual view/download timestamps)
    prisma.resume.aggregate({
      where: { 
        userId: session.user.id,
        updatedAt: { gte: lastWeek }
      },
      _sum: { viewCount: true },
    }).then(r => r._sum.viewCount || 0),
    prisma.resume.aggregate({
      where: { 
        userId: session.user.id,
        updatedAt: { gte: twoWeeksAgo, lt: lastWeek }
      },
      _sum: { viewCount: true },
    }).then(r => r._sum.viewCount || 0),
    prisma.resume.aggregate({
      where: { 
        userId: session.user.id,
        updatedAt: { gte: lastWeek }
      },
      _sum: { downloadCount: true },
    }).then(r => r._sum.downloadCount || 0),
    prisma.resume.aggregate({
      where: { 
        userId: session.user.id,
        updatedAt: { gte: twoWeeksAgo, lt: lastWeek }
      },
      _sum: { downloadCount: true },
    }).then(r => r._sum.downloadCount || 0),
    prisma.jobApplication.count({
      where: { 
        userId: session.user.id,
        createdAt: { gte: lastWeek }
      },
    }),
    prisma.jobApplication.count({
      where: { 
        userId: session.user.id,
        createdAt: { gte: twoWeeksAgo, lt: lastWeek }
      },
    }),
  ])

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const viewsTrend = calculateTrend(lastWeekViews, previousWeekViews)
  const downloadsTrend = calculateTrend(lastWeekDownloads, previousWeekDownloads)
  const applicationsTrend = lastWeekApplications - previousWeekApplications

  // Recent AI interactions
  const recentAI = await prisma.aIInteraction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      type: true,
      createdAt: true,
      wasSuccessful: true,
    },
  })

  // Find draft or most recent resume
  const draftResume = resumes.find(r => r.status === 'DRAFT') || resumes[0]

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className="mt-2 text-[#9ca3af]">
              Here&#39;s your resume building overview
            </p>
          </div>
          <Link href="/dashboard/resumes/new">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Resume
            </Button>
          </Link>
        </div>

        {/* Quick Stats with Micro-Trends */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Views */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#2fabb8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#2fabb8]/10 w-fit">
                  <Eye className="w-5 h-5 text-[#2fabb8]" />
                </div>
                {viewsTrend !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    viewsTrend > 0 
                      ? 'bg-[#10b981]/10 text-[#10b981]' 
                      : 'bg-[#ef4444]/10 text-[#ef4444]'
                  }`}>
                    {viewsTrend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : viewsTrend < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {Math.abs(viewsTrend)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalViews}</p>
              <p className="text-sm text-[#9ca3af] mb-2">Profile Views</p>
              {(lastWeekViews > 0 || totalViews > 0) && (
                <p className="text-xs text-[#6b7280]">
                  {viewsTrend > 0 && '↑ '}
                  {viewsTrend < 0 && '↓ '}
                  {lastWeekViews} this week
                </p>
              )}
            </div>
          </div>

          {/* Downloads */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#f59e0b]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#f59e0b]/10 w-fit">
                  <Download className="w-5 h-5 text-[#f59e0b]" />
                </div>
                {downloadsTrend !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    downloadsTrend > 0 
                      ? 'bg-[#10b981]/10 text-[#10b981]' 
                      : 'bg-[#ef4444]/10 text-[#ef4444]'
                  }`}>
                    {downloadsTrend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : downloadsTrend < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {Math.abs(downloadsTrend)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{totalDownloads}</p>
              <p className="text-sm text-[#9ca3af] mb-2">Downloads</p>
              {(lastWeekDownloads > 0 || totalDownloads > 0) && (
                <p className="text-xs text-[#6b7280]">
                  {downloadsTrend > 0 && '↑ '}
                  {downloadsTrend < 0 && '↓ '}
                  {lastWeekDownloads} this week
                </p>
              )}
            </div>
          </div>

          {/* Applications */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#8b5cf6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#8b5cf6]/10 w-fit">
                  <Briefcase className="w-5 h-5 text-[#8b5cf6]" />
                </div>
                {applicationsTrend !== 0 && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    applicationsTrend > 0 
                      ? 'bg-[#10b981]/10 text-[#10b981]' 
                      : 'bg-[#ef4444]/10 text-[#ef4444]'
                  }`}>
                    {applicationsTrend > 0 ? '+' : ''}
                    {applicationsTrend}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{applicationCount}</p>
              <p className="text-sm text-[#9ca3af] mb-2">Applications</p>
              {(lastWeekApplications > 0 || applicationCount > 0) && (
                <p className="text-xs text-[#6b7280]">
                  {applicationsTrend > 0 && '↑ '}
                  {applicationsTrend < 0 && '↓ '}
                  {lastWeekApplications} this week
                </p>
              )}
            </div>
          </div>

          {/* Avg Score */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#10b981]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="relative flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-[#10b981]/10 w-fit">
                  <Award className="w-5 h-5 text-[#10b981]" />
                </div>
                {avgScore > 0 && avgScore >= 80 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#10b981]">
                    <Sparkles className="w-3 h-3" />
                    Great
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {avgScore > 0 ? `${Math.round(avgScore)}%` : 'N/A'}
              </p>
              <p className="text-sm text-[#9ca3af] mb-2">Quality Score</p>
              {avgScore > 0 && avgScore < 80 && (
                <p className="text-xs text-[#f59e0b]">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Can improve
                </p>
              )}
              {avgScore === 0 && resumes.length > 0 && (
                <p className="text-xs text-[#6b7280]">
                  Run AI analysis
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Resumes - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Resumes */}
            <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                    <FileText className="w-5 h-5 text-[#50a3f8]" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Recent Resumes
                  </h2>
                </div>
                <Link href="/dashboard/resumes">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-[#2a2b2b] mb-4">
                    <FileText className="w-8 h-8 text-[#9ca3af]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No resumes yet
                  </h3>
                  <p className="text-[#9ca3af] mb-6">
                    Create your first resume to get started
                  </p>
                  <Link href="/dashboard/resumes/new">
                    <Button className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Resume
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <Link
                      key={resume.id}
                      href={`/dashboard/resumes/${resume.id}`}
                      className="block p-4 rounded-lg bg-[#2a2b2b] hover:bg-[#3a3b3b] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <h3 className="font-medium text-white group-hover:text-[#50a3f8] transition-colors">
                            {resume.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            resume.status === 'DRAFT' 
                              ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                              : resume.status === 'ACTIVE'
                              ? 'bg-[#10b981]/10 text-[#10b981]'
                              : 'bg-[#6b7280]/10 text-[#6b7280]'
                          }`}>
                            {resume.status.toLowerCase()}
                          </span>
                        </div>
                        {resume.aiScore && (
                          <span className="px-2.5 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm font-semibold">
                            {Math.round(resume.aiScore)}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#9ca3af]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {resume.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {resume.downloadCount}
                        </span>
                        {resume.template && (
                          <span className="text-xs">
                            {resume.template.name}
                          </span>
                        )}
                        <span className="text-xs ml-auto">
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent AI Activity */}
            <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#50a3f8] to-[#2fabb8]">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Recent AI Activity
                </h2>
              </div>

              {recentAI.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-[#9ca3af] mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-[#9ca3af]">
                    No AI interactions yet. Try enhancing your resume!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAI.map((interaction, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-[#2a2b2b] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          interaction.wasSuccessful 
                            ? 'bg-[#10b981]/10' 
                            : 'bg-[#ef4444]/10'
                        }`}>
                          <Sparkles className={`w-4 h-4 ${
                            interaction.wasSuccessful 
                              ? 'text-[#10b981]' 
                              : 'text-[#ef4444]'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white capitalize">
                            {interaction.type.toLowerCase().replace('_', ' ')}
                          </p>
                          <p className="text-xs text-[#9ca3af]">
                            {new Date(interaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Usage Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Usage Stats Widget */}
            <UsageStatsWidget 
              userId={session.user.id} 
              plan={user?.plan || 'FREE'} 
            />

            {/* Quick Actions */}
            {/* <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#1d1d1d]">
  <h3 className="text-lg font-semibold text-white mb-4">
    Quick Actions
  </h3>

  <div className="space-y-3">
    <Link href="/dashboard/templates">
      <Button
        variant="outline"
        className="w-full justify-start pb-3 border-[#3a3a3a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition"
      >
        <FileText className="w-4 h-4 mr-3 text-gray-400" />
        Browse Templates
      </Button>
    </Link>

    <Link href="/dashboard/analytics">
      <Button
        variant="outline"
        className="w-full justify-start border-[#3a3a3a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition"
      >
        <TrendingUp className="w-4 h-4 mr-3 text-gray-400" />
        View Analytics
      </Button>
    </Link>

    <Link href="/dashboard/applications">
      <Button
        variant="outline"
        className="w-full justify-start border-[#3a3a3a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition"
      >
        <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
        Track Applications
      </Button>
    </Link>
  </div>
</div> */}

          </div>
        </div>
      </div>
    </div>
  )
}