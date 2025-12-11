/* eslint-disable @typescript-eslint/no-explicit-any */
// components/templates/TemplateCard.tsx
'use client'

import { useState } from 'react'
import { Crown, Eye, Check, Lock, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TemplatePreviewModal } from './TemplatePreviewModal'

interface Template {
  id: string
  name: string
  description: string | null
  category: string
  thumbnail: string | null
  isPremium: boolean
  usageCount: number
  structure?: any
}

interface TemplateCardProps {
  template: Template
  canUse: boolean
  isPro: boolean
}

// Generate actual resume preview based on template structure
function ResumePreview({ template }: { template: Template }) {
  const structure = template.structure || {}
  const colors = structure.colors || {
    primary: '#50a3f8',
    secondary: '#2fabb8',
    text: '#1F2937',
    background: '#FFFFFF'
  }

  // Different layouts based on category
  const getLayoutComponent = () => {
    switch (template.category) {
      case 'MODERN':
        return (
          <div className="h-full bg-white p-4 text-xs">
            {/* Header with colored bar */}
            <div 
              className="h-12 -mx-4 -mt-4 mb-3 flex items-center px-4"
              style={{ backgroundColor: colors.primary }}
            >
              <div className="text-white font-bold text-sm">JOHN DOE</div>
            </div>
            
            {/* Two column layout */}
            <div className="grid grid-cols-3 gap-3 h-[calc(100%-3rem)]">
              {/* Left sidebar */}
              <div className="space-y-3">
                <div>
                  <div 
                    className="font-bold text-xs mb-1 pb-1 border-b-2"
                    style={{ 
                      color: colors.primary,
                      borderColor: colors.primary
                    }}
                  >
                    CONTACT
                  </div>
                  <div className="space-y-1 text-[8px]" style={{ color: colors.text }}>
                    <div>john@email.com</div>
                    <div>+1 234 567 8900</div>
                    <div>New York, NY</div>
                  </div>
                </div>
                
                <div>
                  <div 
                    className="font-bold text-xs mb-1 pb-1 border-b-2"
                    style={{ 
                      color: colors.primary,
                      borderColor: colors.primary
                    }}
                  >
                    SKILLS
                  </div>
                  <div className="space-y-1">
                    {[85, 90, 75, 80].map((width, i) => (
                      <div key={i}>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${width}%`,
                              backgroundColor: colors.secondary
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right content */}
              <div className="col-span-2 space-y-2">
                <div>
                  <div 
                    className="font-bold text-xs mb-1 pb-1 border-b"
                    style={{ color: colors.primary }}
                  >
                    EXPERIENCE
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="font-semibold text-[9px]" style={{ color: colors.text }}>Senior Developer</div>
                      <div className="text-[7px] text-gray-500">Tech Company • 2020-Present</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[9px]" style={{ color: colors.text }}>Developer</div>
                      <div className="text-[7px] text-gray-500">Startup Inc • 2018-2020</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div 
                    className="font-bold text-xs mb-1 pb-1 border-b"
                    style={{ color: colors.primary }}
                  >
                    EDUCATION
                  </div>
                  <div className="text-[9px]" style={{ color: colors.text }}>
                    <div className="font-semibold">Bachelor of Science</div>
                    <div className="text-[7px] text-gray-500">University Name • 2014-2018</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'CLASSIC':
        return (
          <div className="h-full bg-white p-4 text-xs">
            {/* Centered header */}
            <div className="text-center mb-3 pb-2 border-b-2 border-gray-300">
              <div className="font-bold text-sm" style={{ color: colors.text }}>JOHN DOE</div>
              <div className="text-[8px] text-gray-600 mt-0.5">john@email.com | +1 234 567 8900</div>
            </div>
            
            {/* Single column content */}
            <div className="space-y-2.5">
              <div>
                <div className="font-bold text-xs mb-1.5 uppercase tracking-wide" style={{ color: colors.text }}>
                  Professional Summary
                </div>
                <div className="h-8 space-y-0.5">
                  <div className="h-1 bg-gray-200 rounded w-full" />
                  <div className="h-1 bg-gray-200 rounded w-11/12" />
                  <div className="h-1 bg-gray-200 rounded w-10/12" />
                </div>
              </div>
              
              <div>
                <div className="font-bold text-xs mb-1.5 uppercase tracking-wide" style={{ color: colors.text }}>
                  Experience
                </div>
                <div className="space-y-1.5">
                  <div>
                    <div className="font-semibold text-[9px]">Senior Developer</div>
                    <div className="text-[7px] text-gray-500">Tech Company | 2020 - Present</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[9px]">Developer</div>
                    <div className="text-[7px] text-gray-500">Startup Inc | 2018 - 2020</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="font-bold text-xs mb-1.5 uppercase tracking-wide" style={{ color: colors.text }}>
                  Education
                </div>
                <div className="text-[9px]">
                  <div className="font-semibold">Bachelor of Science</div>
                  <div className="text-[7px] text-gray-500">University Name | 2014 - 2018</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'CREATIVE':
        return (
          <div className="h-full relative overflow-hidden">
            {/* Colored sidebar */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-16"
              style={{ 
                background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})`
              }}
            />
            
            <div className="absolute left-16 right-0 top-0 bottom-0 bg-white p-3 text-xs">
              {/* Header */}
              <div className="mb-3">
                <div 
                  className="font-bold text-sm mb-0.5"
                  style={{ color: colors.primary }}
                >
                  JOHN DOE
                </div>
                <div className="text-[8px] text-gray-600">Senior Developer</div>
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <div>
                  <div 
                    className="font-bold text-[10px] mb-1"
                    style={{ color: colors.primary }}
                  >
                    ABOUT
                  </div>
                  <div className="space-y-0.5">
                    <div className="h-1 bg-gray-200 rounded w-full" />
                    <div className="h-1 bg-gray-200 rounded w-11/12" />
                  </div>
                </div>
                
                <div>
                  <div 
                    className="font-bold text-[10px] mb-1"
                    style={{ color: colors.primary }}
                  >
                    EXPERIENCE
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px]">
                      <div className="font-semibold">Senior Developer</div>
                      <div className="text-[7px] text-gray-500">2020 - Present</div>
                    </div>
                    <div className="text-[8px]">
                      <div className="font-semibold">Developer</div>
                      <div className="text-[7px] text-gray-500">2018 - 2020</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'MINIMALIST':
        return (
          <div className="h-full bg-white p-4 text-xs">
            <div className="mb-4">
              <div className="font-bold text-base tracking-tight" style={{ color: colors.text }}>
                John Doe
              </div>
              <div className="text-[8px] text-gray-500 mt-0.5">
                john@email.com • +1 234 567 8900
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold mb-1 text-gray-800">Experience</div>
                <div className="space-y-1.5 pl-2 border-l-2" style={{ borderColor: colors.primary }}>
                  <div>
                    <div className="text-[9px] font-medium">Senior Developer</div>
                    <div className="text-[7px] text-gray-500">Tech Company</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium">Developer</div>
                    <div className="text-[7px] text-gray-500">Startup Inc</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-[10px] font-semibold mb-1 text-gray-800">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {['React', 'Node.js', 'TypeScript', 'Python'].map((skill, i) => (
                    <span 
                      key={i}
                      className="px-1.5 py-0.5 text-[7px] rounded"
                      style={{ 
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-full bg-white p-4 text-xs">
            <div 
              className="h-10 rounded-lg mb-3 flex items-center px-3"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <div 
                className="font-bold text-sm"
                style={{ color: colors.primary }}
              >
                JOHN DOE
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="font-bold text-[10px] mb-1" style={{ color: colors.text }}>
                  EXPERIENCE
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-200 rounded w-full" />
                  <div className="h-1.5 bg-gray-200 rounded w-11/12" />
                </div>
              </div>
              
              <div>
                <div className="font-bold text-[10px] mb-1" style={{ color: colors.text }}>
                  SKILLS
                </div>
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="h-4 w-12 rounded"
                      style={{ backgroundColor: `${colors.secondary}30` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-inner">
      {getLayoutComponent()}
    </div>
  )
}

export function TemplateCard({ template, canUse, isPro }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryColor = () => {
    const colors = {
      MODERN: { primary: '#50a3f8', secondary: '#2fabb8' },
      CLASSIC: { primary: '#6b7280', secondary: '#9ca3af' },
      CREATIVE: { primary: '#f59e0b', secondary: '#fbbf24' },
      MINIMALIST: { primary: '#2fabb8', secondary: '#50a3f8' },
      PROFESSIONAL: { primary: '#50a3f8', secondary: '#2fabb8' },
      TECHNICAL: { primary: '#6366f1', secondary: '#8b5cf6' },
    }
    return colors[template.category as keyof typeof colors] || colors.MODERN
  }

  const colors = getCategoryColor()

  return (
    <>
      <div 
        className={`
          group relative rounded-xl border overflow-hidden transition-all duration-300
          ${isHovered ? 'border-[#50a3f8] -translate-y-1' : 'border-[#2a2b2b]'}
          bg-[#242525]
        `}
        style={{
          boxShadow: isHovered ? `0 20px 40px ${colors.primary}15` : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Preview Container */}
        <div className="relative h-72 bg-[#2a2b2b] p-4">
          <ResumePreview template={template} />
          
          {/* Premium Badge */}
          {template.isPremium && (
            <Badge 
              className="absolute top-3 right-3 shadow-lg font-bold border-0"
              style={{
                background: 'linear-gradient(135deg, #50a3f8, #2fabb8)',
                color: '#ffffff'
              }}
            >
              <Crown className="w-3 h-3 mr-1" />
              PRO
            </Badge>
          )}

          {/* Popular Badge */}
          {template.usageCount > 100 && (
            <Badge 
              variant="secondary"
              className="absolute top-3 left-3 font-medium backdrop-blur-sm"
              style={{
                backgroundColor: '#ffffff20',
                color: '#ffffff',
                borderColor: 'transparent'
              }}
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}

          {/* Hover Overlay */}
          <div 
            className={`
              absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black/60
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="shadow-lg bg-white hover:bg-gray-100"
              style={{ color: colors.primary }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="mb-4">
            <h3 className="font-semibold mb-1.5 text-lg text-white truncate">
              {template.name}
            </h3>
            <p className="text-sm line-clamp-2 text-[#9ca3af]">
              {template.description || 'Professional resume template designed for success'}
            </p>
          </div>

          {/* Category & Usage */}
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="secondary"
              className="font-medium"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                borderColor: 'transparent'
              }}
            >
              {template.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-[#9ca3af]">
              <Star className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              <span>{template.usageCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Button */}
          {canUse ? (
            <Button 
              className="w-full transition-all hover:scale-[1.02] shadow-md font-semibold"
              size="sm"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: '#ffffff'
              }}
              onClick={() => {
                // TODO: Implement template selection
                alert('Template selection coming soon!')
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full transition-all hover:scale-[1.02] font-semibold"
              size="sm"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: `${colors.primary}10`
              }}
              onClick={() => window.location.href = '/dashboard/upgrade'}
            >
              <Lock className="w-4 h-4 mr-2" />
              Upgrade to Use
            </Button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={template}
        open={showPreview}
        onClose={() => setShowPreview(false)}
        canUse={canUse}
        isPro={isPro}
      />
    </>
  )
}