// components/settings/BillingClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Crown, 
  CreditCard, 
  Download,
  TrendingUp,
  AlertCircle,
  Loader2,
  ExternalLink,
  Zap,
  FileText,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface User {
  name: string | null
  email: string
  plan: string
}

interface Subscription {
  status: string | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  stripeCustomerId: string | null
} 

interface UsageStats {
  resumesCreated: number
  resumesLimit: number
  aiCreditsUsed: number
  aiCreditsLimit: number
  totalViews: number
  totalDownloads: number
  lastResetAt: Date
}

interface Interaction {
  type: string
  createdAt: Date
  tokensUsed: number | null
}

interface BillingClientProps {
  user: User
  subscription: Subscription | null  // Changed to allow null
  usageStats: UsageStats
  recentInteractions: Interaction[]
}

export function BillingClient({
  user,
  subscription,
  usageStats,
  recentInteractions,
}: BillingClientProps) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open portal')
      }

      window.location.href = data.url
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to open portal')
      setLoading(false)
    }
  }

  const isPro = user.plan === 'PRO' || user.plan === 'ENTERPRISE'
  const isActive = subscription?.status === 'active'
  const willCancel = subscription?.cancelAtPeriodEnd ?? false

  const aiCreditsPercentage = (usageStats.aiCreditsUsed / usageStats.aiCreditsLimit) * 100
  const resumePercentage = usageStats.resumesLimit === -1 
    ? 0 
    : (usageStats.resumesCreated / usageStats.resumesLimit) * 100

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Billing & Usage
          </h1>
          <p className="text-[#9ca3af]">
            Manage your subscription and monitor your usage
          </p>
        </div>

        {/* Current Plan */}
        <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                isPro 
                  ? 'bg-gradient-to-br from-[#50a3f8] to-[#2fabb8]'
                  : 'bg-[#2a2b2b]'
              }`}>
                {isPro ? (
                  <Crown className="w-6 h-6 text-white" />
                ) : (
                  <FileText className="w-6 h-6 text-[#9ca3af]" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user.plan} Plan
                </h2>
                {subscription && isActive ? (
                  <div className="space-y-1 text-sm text-[#9ca3af]">
                    <p>
                      Status: <span className="text-[#10b981]">Active</span>
                    </p>
                    {subscription.currentPeriodEnd && (
                      <p>
                        {willCancel ? 'Cancels' : 'Renews'} on{' '}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#9ca3af]">
                    Free plan with basic features
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isPro && subscription?.stripeCustomerId ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                    </>
                  )}
                </Button>
              ) : (
                <Link href="/dashboard/upgrade">
                  <Button className="bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Warning for cancellation */}
          {willCancel && subscription?.currentPeriodEnd && (
            <div className="p-4 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#f59e0b] mb-1">
                  Subscription Ending
                </p>
                <p className="text-sm text-[#9ca3af]">
                  Your subscription will end on{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. 
                  You&#39;ll be downgraded to the Free plan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Credits */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                aiCreditsPercentage >= 80 ? 'bg-[#ef4444]/10' : 'bg-[#f59e0b]/10'
              }`}>
                <Zap className={`w-5 h-5 ${
                  aiCreditsPercentage >= 80 ? 'text-[#ef4444]' : 'text-[#f59e0b]'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Credits</h3>
                <p className="text-sm text-[#9ca3af]">
                  {usageStats.aiCreditsUsed} / {usageStats.aiCreditsLimit} used
                </p>
              </div>
            </div>

            <div className="relative h-2 bg-[#2a2b2b] rounded-full overflow-hidden mb-4">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  aiCreditsPercentage >= 80
                    ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                    : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706]'
                }`}
                style={{ width: `${Math.min(aiCreditsPercentage, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9ca3af]">Remaining</span>
              <span className="font-semibold text-white">
                {usageStats.aiCreditsLimit - usageStats.aiCreditsUsed} credits
              </span>
            </div>

            <p className="text-xs text-[#6b7280] mt-3">
              Resets on {new Date(usageStats.lastResetAt).toLocaleDateString()}
            </p>
          </div>

          {/* Resumes */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                <FileText className="w-5 h-5 text-[#50a3f8]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Resumes</h3>
                <p className="text-sm text-[#9ca3af]">
                  {usageStats.resumesCreated} / {usageStats.resumesLimit === -1 ? '∞' : usageStats.resumesLimit} created
                </p>
              </div>
            </div>

            {usageStats.resumesLimit !== -1 && (
              <div className="relative h-2 bg-[#2a2b2b] rounded-full overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] transition-all duration-500"
                  style={{ width: `${Math.min(resumePercentage, 100)}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#9ca3af]">
                {usageStats.resumesLimit === -1 ? 'Unlimited' : 'Remaining'}
              </span>
              <span className="font-semibold text-white">
                {usageStats.resumesLimit === -1 
                  ? '∞' 
                  : usageStats.resumesLimit - usageStats.resumesCreated}
              </span>
            </div>
          </div>

          {/* Total Views */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2fabb8]/10">
                <Eye className="w-5 h-5 text-[#2fabb8]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Total Views</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Downloads */}
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#10b981]/10">
                <Download className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Total Downloads</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {usageStats.totalDownloads.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent AI Usage */}
        <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent AI Activity
          </h3>

          {recentInteractions.length === 0 ? (
            <p className="text-center text-[#9ca3af] py-8">
              No AI interactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentInteractions.map((interaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#2a2b2b]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                      <Zap className="w-4 h-4 text-[#50a3f8]" />
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
                  {interaction.tokensUsed && (
                    <span className="text-xs text-[#9ca3af]">
                      {interaction.tokensUsed} tokens
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade CTA for Free Users */}
        {!isPro && (
          <div className="p-8 rounded-xl border border-[#50a3f8]/30 bg-gradient-to-br from-[#50a3f8]/5 to-[#2fabb8]/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#50a3f8] to-[#2fabb8]">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-[#9ca3af] mb-4">
                  Upgrade to Pro for unlimited resumes, 100 AI credits/month, premium templates, and more!
                </p>
                <Link href="/dashboard/upgrade">
                  <Button className="bg-gradient-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white">
                    <Crown className="w-4 h-4 mr-2" />
                    View Pricing Plans
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}