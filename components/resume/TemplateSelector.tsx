/* eslint-disable @typescript-eslint/no-explicit-any */
// components/templates/TemplateSelector.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, Check, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Template {
  id: string
  name: string
  description: string
  category: string
  isPremium: boolean
  previewImage: string | null
  structure?: any
}

interface TemplateSelectorProps {
  templates: Template[]
  isPro: boolean
}

// Toast notification component
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="bg-[#242525] border border-[#2a2b2b] rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#50a3f8] flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
        <p className="text-white font-medium flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="text-[#7e7e7e] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
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

export function TemplateSelector({ templates, isPro }: TemplateSelectorProps) {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [selectedTemplateName, setSelectedTemplateName] = useState('')

  const handleSelectTemplate = (template: Template, canUse: boolean) => {
    if (!canUse) {
      // Redirect to upgrade page for premium templates
      router.push('/dashboard/upgrade')
      return
    }

    // Show toast notification
    setSelectedTemplateName(template.name)
    setShowToast(true)

    // Navigate after a brief delay to show the toast
    setTimeout(() => {
      router.push(`/dashboard/resumes/new?template=${template.id}`)
    }, 800)
  }

  const handleSkip = () => {
    // Navigate to resume builder without template
    router.push('/dashboard/resumes/new')
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Choose a Template
          </h2>
          <p className="text-[#7e7e7e]">
            Click any template to start building your resume instantly
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const canUse = !template.isPremium || isPro

            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template, canUse)}
                className={`
                  relative rounded-xl border-2 p-4 text-left transition-all
                  border-[#2a2b2b] bg-[#242525] hover:border-[#50a3f8] hover:bg-[#50a3f8]/5
                  ${!canUse ? 'opacity-75' : 'cursor-pointer hover:scale-[1.02]'}
                `}
              >
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#50a3f8] flex items-center gap-1 z-10">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">Pro</span>
                  </div>
                )}

                {/* Preview */}
                <div className="aspect-[8.5/11] rounded-lg bg-[#1a1b1b] mb-3 overflow-hidden">
                  {template.previewImage ? (
                    <img 
                      src={template.previewImage} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ResumePreview template={template} />
                  )}
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-[#7e7e7e] line-clamp-2">
                    {template.description}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[#2a2b2b] text-[#7e7e7e]">
                    {template.category}
                  </span>
                </div>

                {/* Locked Overlay */}
                {!canUse && (
                  <div className="absolute inset-0 rounded-xl bg-[#191a1a]/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <div className="text-center">
                      <Crown className="w-8 h-8 text-[#50a3f8] mx-auto mb-2" />
                      <p className="text-sm font-medium text-white mb-1">Pro Template</p>
                      <p className="text-xs text-[#7e7e7e]">Click to upgrade</p>
                    </div>
                  </div>
                )}

                {/* Hover effect indicator */}
                {canUse && (
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#50a3f8] transition-colors pointer-events-none" />
                )}
              </button>
            )
          })}
        </div>

        {/* Skip Button - Centered below grid */}
        <div className="flex items-center justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-[#2a2b2b] text-[#7e7e7e] hover:bg-[#2a2b2b] hover:text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start with Blank Template
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast 
          message={`Loading "${selectedTemplateName}" template...`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}