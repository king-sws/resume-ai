/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/AIEnhanceButton.tsx
'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface AIEnhanceButtonProps {
  text: string
  type: 'summary' | 'experience' | 'skills'
  onEnhanced: (enhancedText: string) => void
}

export function AIEnhanceButton({ text, type, onEnhanced }: AIEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)

  const handleEnhance = async () => {
    if (!text || text.trim().length === 0) {
      toast.error('Please enter some text first')
      return
    }

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          toast.error(data.message || 'AI credits limit reached')
        } else {
          throw new Error(data.error || 'Failed to enhance text')
        }
        return
      }

      onEnhanced(data.enhanced)
      toast.success(`✨ Text enhanced! ${data.creditsRemaining} credits remaining`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to enhance text')
      console.error(error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleEnhance}
      disabled={isEnhancing || !text}
      className="bg-gradient-to-r from-[#50a3f8]/10 to-[#2fabb8]/10 border-[#50a3f8]/30 text-[#50a3f8] hover:bg-[#50a3f8]/20 hover:border-[#50a3f8] transition-all"
    >
      {isEnhancing ? (
        <>
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Enhancing...
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3 mr-1" />
          AI Enhance
        </>
      )}
    </Button>
  )
}