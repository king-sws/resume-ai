// components/templates/TemplatePreviewModal.tsx
'use client'

import { X, Check, Lock, Crown, Star, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  thumbnail: string | null
  isPremium: boolean
  usageCount: number
}

interface TemplatePreviewModalProps {
  template: Template
  open: boolean
  onClose: () => void
  canUse: boolean
  isPro: boolean
}

export function TemplatePreviewModal({ 
  template, 
  open, 
  onClose,
  canUse,
  isPro
}: TemplatePreviewModalProps) {
  const getCategoryColor = () => {
    const colors = {
      MODERN: { primary: '#50a3f8', secondary: '#2fabb8' },
      CLASSIC: { primary: '#7e7e7e', secondary: '#5a5a5a' },
      CREATIVE: { primary: '#50a3f8', secondary: '#2fabb8' },
      MINIMALIST: { primary: '#7e7e7e', secondary: '#2fabb8' },
      PROFESSIONAL: { primary: '#2fabb8', secondary: '#50a3f8' },
      TECHNICAL: { primary: '#50a3f8', secondary: '#2fabb8' },
    }
    return colors[template.category as keyof typeof colors] || colors.MODERN
  }

  const colors = getCategoryColor()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#242525',
          borderColor: '#2a2b2b'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: '#2a2b2b' }}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {template.name}
              </h2>
              {template.isPremium && (
                <span 
                  className="px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #50a3f8, #2fabb8)',
                    color: '#ffffff'
                  }}
                >
                  <Crown className="w-3 h-3" />
                  <span>PRO</span>
                </span>
              )}
              {template.usageCount > 100 && (
                <span 
                  className="px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5"
                  style={{
                    backgroundColor: colors.primary + '20',
                    color: colors.primary
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>Popular</span>
                </span>
              )}
            </div>
            <p style={{ color: '#7e7e7e' }}>
              {template.description || 'Professional resume template designed for success'}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span 
                className="px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: colors.primary + '20',
                  color: colors.primary
                }}
              >
                {template.category}
              </span>
              <div className="flex items-center gap-1.5" style={{ color: '#7e7e7e' }}>
                <Star className="w-4 h-4" style={{ color: colors.primary }} />
                <span>{template.usageCount.toLocaleString()} uses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="py-6">
          <div 
            className="w-full aspect-[8.5/11] rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
            }}
          >
            {/* Mock Full Resume Preview */}
            <div className="h-full p-8 text-white">
              <div className="h-full bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white/20 p-8 space-y-4">
                {/* Header */}
                <div className="text-center border-b-2 border-white/30 pb-4">
                  <div className="h-6 bg-white/90 rounded w-1/2 mx-auto mb-2" />
                  <div className="h-3 bg-white/70 rounded w-2/3 mx-auto mb-1" />
                  <div className="h-2 bg-white/60 rounded w-3/5 mx-auto" />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/80 rounded w-1/3" />
                  <div className="space-y-1">
                    <div className="h-2 bg-white/50 rounded w-full" />
                    <div className="h-2 bg-white/50 rounded w-5/6" />
                    <div className="h-2 bg-white/50 rounded w-4/6" />
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/80 rounded w-1/3" />
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-2/5" />
                      <div className="h-2 bg-white/50 rounded w-3/5" />
                      <div className="h-2 bg-white/40 rounded w-full" />
                      <div className="h-2 bg-white/40 rounded w-4/5" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-white/60 rounded w-2/5" />
                      <div className="h-2 bg-white/50 rounded w-3/5" />
                      <div className="h-2 bg-white/40 rounded w-full" />
                      <div className="h-2 bg-white/40 rounded w-3/5" />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/80 rounded w-1/4" />
                  <div className="space-y-1">
                    <div className="h-3 bg-white/60 rounded w-2/5" />
                    <div className="h-2 bg-white/50 rounded w-3/5" />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/80 rounded w-1/5" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-2 bg-white/50 rounded w-1/6" />
                    <div className="h-2 bg-white/50 rounded w-1/5" />
                    <div className="h-2 bg-white/50 rounded w-1/6" />
                    <div className="h-2 bg-white/50 rounded w-1/4" />
                    <div className="h-2 bg-white/50 rounded w-1/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t pt-4" style={{ borderColor: '#2a2b2b' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
            <Sparkles className="w-5 h-5" style={{ color: colors.primary }} />
            Template Features
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>ATS-Friendly Format</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>Professional Design</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>Easy Customization</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>Print-Ready PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>Multiple Export Options</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <Check className="w-3 h-3" style={{ color: colors.primary }} />
              </div>
              <span style={{ color: '#7e7e7e' }}>Mobile Responsive</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4" style={{ borderColor: '#2a2b2b' }}>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            style={{
              borderColor: '#2a2b2b',
              color: '#7e7e7e',
              backgroundColor: 'transparent'
            }}
          >
            Close
          </Button>
          
          {canUse ? (
            <Button 
              className="flex-1 transition-all hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: '#ffffff'
              }}
              onClick={() => {
                // TODO: Implement template selection
                alert('Template selection coming soon!')
                onClose()
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          ) : (
            <Button
              className="flex-1 transition-all hover:scale-105 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #50a3f8, #2fabb8)',
                color: '#ffffff'
              }}
              onClick={() => window.location.href = '/dashboard/upgrade'}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Use
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}