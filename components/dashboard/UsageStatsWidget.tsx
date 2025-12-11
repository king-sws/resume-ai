// components/dashboard/UsageStatsWidget.tsx
'use client'

import { useEffect, useState } from 'react'
import { Zap, FileText, Crown, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UsageStats {
  aiCreditsUsed: number
  aiCreditsLimit: number
  resumesCreated: number
  resumesLimit: number
}

interface UsageStatsWidgetProps {
  userId: string
  plan: string
}

export function UsageStatsWidget({ userId, plan }: UsageStatsWidgetProps) {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/usage-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] animate-pulse">
        <div className="h-4 bg-[#2a2b2b] rounded w-1/2 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-[#2a2b2b] rounded" />
          <div className="h-12 bg-[#2a2b2b] rounded" />
        </div>
      </div>
    )
  }

  if (!stats) return null

  const aiCreditsPercentage = (stats.aiCreditsUsed / stats.aiCreditsLimit) * 100
  const resumesPercentage = stats.resumesLimit === -1 
    ? 0 
    : (stats.resumesCreated / stats.resumesLimit) * 100

  const isAiLimitClose = aiCreditsPercentage >= 80
  const isResumeLimitReached = stats.resumesLimit !== -1 && resumesPercentage >= 100

  return (
    <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Usage Stats</h3>
          <p className="text-sm text-[#9ca3af] mt-1">
            Track your plan limits
          </p>
        </div>
        {plan === 'FREE' && (
          <Link href="/dashboard/upgrade">
            <Button
              size="sm"
              className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade
            </Button>
          </Link>
        )}
      </div>

      {/* AI Credits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              isAiLimitClose ? 'bg-[#ef4444]/10' : 'bg-[#f59e0b]/10'
            }`}>
              <Zap className={`w-4 h-4 ${
                isAiLimitClose ? 'text-[#ef4444]' : 'text-[#f59e0b]'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">AI Credits</p>
              <p className="text-xs text-[#9ca3af]">
                {stats.aiCreditsUsed} / {stats.aiCreditsLimit} used
              </p>
            </div>
          </div>
          <span className={`text-lg font-bold ${
            isAiLimitClose ? 'text-[#ef4444]' : 'text-[#f59e0b]'
          }`}>
            {stats.aiCreditsLimit - stats.aiCreditsUsed}
          </span>
        </div>
        <div className="relative h-2 bg-[#2a2b2b] rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
              isAiLimitClose
                ? 'bg-linear-to-r from-[#ef4444] to-[#dc2626]'
                : 'bg-linear-to-r from-[#f59e0b] to-[#d97706]'
            }`}
            style={{ width: `${Math.min(aiCreditsPercentage, 100)}%` }}
          />
        </div>
        {isAiLimitClose && plan === 'FREE' && (
          <div className="p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
            <p className="text-xs text-[#ef4444]">
              Running low on AI credits. Upgrade to Pro for 100 credits/month!
            </p>
          </div>
        )}
      </div>

      {/* Resume Limit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              isResumeLimitReached ? 'bg-[#ef4444]/10' : 'bg-[#50a3f8]/10'
            }`}>
              <FileText className={`w-4 h-4 ${
                isResumeLimitReached ? 'text-[#ef4444]' : 'text-[#50a3f8]'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Resumes</p>
              <p className="text-xs text-[#9ca3af]">
                {stats.resumesCreated} / {stats.resumesLimit === -1 ? '∞' : stats.resumesLimit} created
              </p>
            </div>
          </div>
          <span className={`text-lg font-bold ${
            isResumeLimitReached ? 'text-[#ef4444]' : 'text-[#50a3f8]'
          }`}>
            {stats.resumesLimit === -1 ? '∞' : stats.resumesLimit - stats.resumesCreated}
          </span>
        </div>
        {stats.resumesLimit !== -1 && (
          <div className="relative h-2 bg-[#2a2b2b] rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                isResumeLimitReached
                  ? 'bg-linear-to-r from-[#ef4444] to-[#dc2626]'
                  : 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8]'
              }`}
              style={{ width: `${Math.min(resumesPercentage, 100)}%` }}
            />
          </div>
        )}
        {isResumeLimitReached && (
          <div className="p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
            <p className="text-xs text-[#ef4444]">
              Resume limit reached. Upgrade to Pro for unlimited resumes!
            </p>
          </div>
        )}
      </div>

      {/* Upgrade CTA for Free Users */}
      {plan === 'FREE' && (
        <div className="pt-4 border-t border-[#2a2b2b]">
          <div className="p-4 rounded-lg bg-linear-to-br from-[#50a3f8]/5 to-[#2fabb8]/5 border border-[#50a3f8]/20">
            <div className="flex items-start gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-[#50a3f8] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">
                  Unlock More with Pro
                </h4>
                <ul className="text-xs text-[#9ca3af] space-y-1">
                  <li>• Unlimited resumes</li>
                  <li>• 100 AI credits/month</li>
                  <li>• Premium templates</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>
            <Link href="/dashboard/upgrade" className="block">
              <Button
                size="sm"
                className="w-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}