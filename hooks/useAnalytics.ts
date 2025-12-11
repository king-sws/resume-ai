/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/hooks/useAnalytics.ts
'use client'

import { useCallback } from 'react'

export type AnalyticsEvent = 
  | 'resume_created'
  | 'resume_viewed'
  | 'resume_downloaded'
  | 'resume_shared'
  | 'resume_edited'
  | 'template_selected'
  | 'ai_enhance_used'
  | 'ai_analyze_used'
  | 'ai_chat_used'
  | 'application_created'
  | 'application_updated'

interface TrackEventParams {
  eventType: AnalyticsEvent
  resumeId?: string
  metadata?: Record<string, any>
}

export function useAnalytics() {
  const trackEvent = useCallback(async ({ 
    eventType, 
    resumeId, 
    metadata 
  }: TrackEventParams) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          resumeId,
          metadata,
        }),
      })
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.error('Analytics tracking error:', error)
    }
  }, [])

  return { trackEvent }
}
