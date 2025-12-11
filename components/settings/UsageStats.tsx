/* eslint-disable react/no-unescaped-entities */
// components/settings/UsageStats.tsx
import Link from 'next/link'
import { TrendingUp, FileText, Sparkles, Crown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { format } from 'date-fns'

interface UsageStatsProps {
  plan: string
  usageStats: {
    resumesCreated: number
    resumesLimit: number
    aiCreditsUsed: number
    aiCreditsLimit: number
    lastResetAt: Date
  } | null
}

export function UsageStats({ plan, usageStats }: UsageStatsProps) {
  const resumesUsed = usageStats?.resumesCreated || 0
  const resumesLimit = usageStats?.resumesLimit || 1
  const aiCreditsUsed = usageStats?.aiCreditsUsed || 0
  const aiCreditsLimit = usageStats?.aiCreditsLimit || 10
  
  const resumePercentage = resumesLimit === -1 ? 0 : (resumesUsed / resumesLimit) * 100
  const aiCreditsPercentage = (aiCreditsUsed / aiCreditsLimit) * 100
  
  const isFreePlan = plan === 'FREE'
  const nextResetDate = usageStats?.lastResetAt 
    ? new Date(new Date(usageStats.lastResetAt).setMonth(new Date(usageStats.lastResetAt).getMonth() + 1))
    : new Date()

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900">Usage & Limits</h2>
        </div>
        {isFreePlan && (
          <Link href="/dashboard/upgrade">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Current Plan</p>
            <p className="text-lg font-semibold text-slate-900 capitalize">
              {plan.toLowerCase()} Plan
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            plan === 'PRO' || plan === 'ENTERPRISE'
              ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {plan === 'PRO' || plan === 'ENTERPRISE' ? 'Premium' : 'Free'}
          </div>
        </div>

        {/* Resume Limit */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Resumes Created</span>
            </div>
            <span className="text-sm text-slate-600">
              {resumesLimit === -1 ? (
                <>
                  {resumesUsed} <span className="text-slate-400">/ Unlimited</span>
                </>
              ) : (
                <>
                  {resumesUsed} / {resumesLimit}
                </>
              )}
            </span>
          </div>
          {resumesLimit !== -1 && (
            <>
              <Progress value={resumePercentage} className="h-2" />
              {resumePercentage >= 100 && (
                <p className="text-xs text-red-600">
                  You've reached your resume limit. Upgrade to create more.
                </p>
              )}
            </>
          )}
        </div>

        {/* AI Credits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">AI Credits Used</span>
            </div>
            <span className="text-sm text-slate-600">
              {aiCreditsUsed} / {aiCreditsLimit}
            </span>
          </div>
          <Progress value={aiCreditsPercentage} className="h-2" />
          {aiCreditsPercentage >= 90 && (
            <p className="text-xs text-orange-600">
              You're running low on AI credits. They'll reset on {format(nextResetDate, 'MMM d, yyyy')}.
            </p>
          )}
        </div>

        {/* Reset Date */}
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900">
              Credits reset on {format(nextResetDate, 'MMMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Pro Plan Benefits */}
        {isFreePlan && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Upgrade to Pro for:</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Unlimited resumes</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>100 AI credits per month</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Access to premium templates</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}