// components/analytics/AnalyticsClient.tsx
'use client'

import { 
  TrendingUp, 
  Eye, 
  Download, 
  Share2, 
  Brain, 
  Briefcase,
  FileText,
  Award,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalResumes: number
    activeResumes: number
    draftResumes: number
    totalViews: number
    totalDownloads: number
    totalShares: number
    averageScore: number
    totalApplications: number
  }
  usage: {
    aiCreditsUsed: number
    aiCreditsLimit: number
    resumesCreated: number
    resumesLimit: number
  }
  aiUsage: {
    byType: Record<string, number>
    totalInteractions: number
    successRate: number
    totalTokens: number
  }
  applications: {
    total: number
    funnel: Record<string, number>
    byStatus: Array<{ status: string; count: number; percentage: number }>
  }
  activity: Array<{
    date: string
    aiInteractions: number
    applications: number
  }>
  topResumes: Array<{
    id: string
    title: string
    totalEngagement: number
    views: number
    downloads: number
    shares: number
    score: number | null
  }>
}

interface AnalyticsClientProps {
  data: AnalyticsData
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
  const statCards = [
    {
      title: 'Total Resumes',
      value: data.summary.totalResumes,
      icon: FileText,
      color: 'text-[#50a3f8]',
      bg: 'bg-[#50a3f8]/10',
    },
    {
      title: 'Total Views',
      value: data.summary.totalViews,
      icon: Eye,
      color: 'text-[#2fabb8]',
      bg: 'bg-[#2fabb8]/10',
    },
    {
      title: 'Downloads',
      value: data.summary.totalDownloads,
      icon: Download,
      color: 'text-[#f59e0b]',
      bg: 'bg-[#f59e0b]/10',
    },
    {
      title: 'Applications',
      value: data.summary.totalApplications,
      icon: Briefcase,
      color: 'text-[#8b5cf6]',
      bg: 'bg-[#8b5cf6]/10',
    },
    {
      title: 'Avg Score',
      value: `${data.summary.averageScore}%`,
      icon: Award,
      color: 'text-[#10b981]',
      bg: 'bg-[#10b981]/10',
    },
    {
      title: 'AI Credits',
      value: `${data.usage.aiCreditsUsed}/${data.usage.aiCreditsLimit}`,
      icon: Zap,
      color: 'text-[#f59e0b]',
      bg: 'bg-[#f59e0b]/10',
    },
  ]

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="mt-2 text-[#9ca3af]">
            Track your resume performance and AI usage
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden"
            >
              <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
              <div className="relative flex flex-col">
                <div className={`p-2 rounded-lg ${stat.bg} w-fit mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-sm text-[#9ca3af] mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Usage & Application Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Usage */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                <Brain className="w-5 h-5 text-[#50a3f8]" />
              </div>
              <h2 className="text-xl font-semibold text-white">AI Usage</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(data.aiUsage.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-[#9ca3af] capitalize">
                    {type.toLowerCase().replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-[#2a2b2b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8]"
                        style={{
                          width: `${(count / data.aiUsage.totalInteractions) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-white font-semibold w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-[#2a2b2b]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9ca3af]">Success Rate</span>
                  <span className="text-white font-semibold">
                    {data.aiUsage.successRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Funnel */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#8b5cf6]/10">
                <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Application Funnel
              </h2>
            </div>
            <div className="space-y-3">
              {data.applications.byStatus.length > 0 ? (
                data.applications.byStatus.map((item) => (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#9ca3af] capitalize">
                        {item.status.toLowerCase().replace('_', ' ')}
                      </span>
                      <span className="text-sm text-white font-semibold">
                        {item.count} ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#2a2b2b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-[#8b5cf6] to-[#6366f1]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[#9ca3af] py-8">
                  No applications yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Top Resumes */}
        <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <h2 className="text-xl font-semibold text-white mb-6">
            Top Performing Resumes
          </h2>
          <div className="space-y-4">
            {data.topResumes.length > 0 ? (
              data.topResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-4 rounded-lg bg-[#2a2b2b] hover:bg-[#3a3b3b] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{resume.title}</h3>
                    {resume.score && (
                      <span className="px-2 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm font-semibold">
                        {Math.round(resume.score)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#9ca3af]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {resume.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {resume.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {resume.shares}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#9ca3af] py-8">
                No resumes yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}