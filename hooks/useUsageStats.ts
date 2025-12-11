
// lib/hooks/useUsageStats.ts
'use client'

import { useCallback, useEffect, useState } from "react"

interface UsageStats {
  aiCreditsUsed: number
  aiCreditsLimit: number
  resumesCreated: number
  resumesLimit: number
  totalViews: number
  totalDownloads: number
}

export function useUsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/usage-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching usage stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const canCreateResume = useCallback(() => {
    if (!stats) return false
    if (stats.resumesLimit === -1) return true // Unlimited
    return stats.resumesCreated < stats.resumesLimit
  }, [stats])

  const canUseAI = useCallback(() => {
    if (!stats) return false
    return stats.aiCreditsUsed < stats.aiCreditsLimit
  }, [stats])

  const getAiCreditsRemaining = useCallback(() => {
    if (!stats) return 0
    return Math.max(0, stats.aiCreditsLimit - stats.aiCreditsUsed)
  }, [stats])

  const getResumesRemaining = useCallback(() => {
    if (!stats) return 0
    if (stats.resumesLimit === -1) return Infinity
    return Math.max(0, stats.resumesLimit - stats.resumesCreated)
  }, [stats])

  return {
    stats,
    loading,
    refresh: fetchStats,
    canCreateResume,
    canUseAI,
    getAiCreditsRemaining,
    getResumesRemaining,
  }
}
