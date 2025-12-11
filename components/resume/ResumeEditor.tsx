/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/ResumeEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResumeForm } from './ResumeForm'
import { ResumePreview } from './ResumePreview'
import { Button } from '@/components/ui/button'
import { Save, Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { QuickPDFGenerator } from './QuickPDFGenerator'

interface ResumeEditorProps {
  resumeId: string
  initialData: any
  initialTitle: string
  initialStatus: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  templateId?: string
  templateStructure?: any // Add template structure
}

export interface ResumeData {
  title: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    location: string
    graduationDate: string
    gpa: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    credentialId: string
  }>
}

export function ResumeEditor({ 
  resumeId, 
  initialData, 
  initialStatus,
  templateStructure
}: ResumeEditorProps) {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savingType, setSavingType] = useState<'draft' | 'publish' | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    const dataChanged = JSON.stringify(resumeData) !== JSON.stringify(initialData)
    setHasChanges(dataChanged)
  }, [resumeData, initialData])

  const validateResumeData = (): string | null => {
    if (!resumeData.title || resumeData.title.trim() === '') {
      return 'Please enter a resume title'
    }
    
    if (!resumeData.personalInfo.fullName || resumeData.personalInfo.fullName.trim() === '') {
      return 'Please enter your full name'
    }
    
    if (resumeData.personalInfo.email && !resumeData.personalInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'Please enter a valid email address'
    }
    
    return null
  }

  const handleUpdate = async (status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => {
    setSaveError(null)
    
    const finalStatus = status || initialStatus
    setSavingType(finalStatus === 'ACTIVE' ? 'publish' : 'draft')
    
    const validationError = validateResumeData()
    if (validationError) {
      toast.error(validationError)
      setSaveError(validationError)
      setSavingType(null)
      return
    }

    setIsSaving(true)
    
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
          title: resumeData.title,
          data: resumeData,
          status: finalStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = result.details 
            ? `Validation error: ${result.details.map((d: any) => d.message).join(', ')}`
            : result.error || 'Invalid resume data'
          throw new Error(errorMessage)
        }
        
        throw new Error(result.error || 'Failed to update resume')
      }

      if (!result.success) {
        throw new Error('Invalid response from server')
      }

      toast.success('Resume updated successfully!')
      setHasChanges(false)
      router.refresh()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update resume'
      console.error('Error updating resume:', error)
      toast.error(errorMessage)
      setSaveError(errorMessage)
    } finally {
      setIsSaving(false)
      setSavingType(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {saveError && (
        <div className="rounded-lg border border-[#ff444430] bg-[#ff444410] p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#ff4444]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#ff4444]">
              {saveError}
            </p>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-sm text-[#ff4444] hover:opacity-70 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 sticky top-20 z-30 shadow-lg">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-[#7e7e7e] bg-transparent hover:text-white hover:bg-[#2a2b2b] transition-all"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>

          {hasChanges && (
            <span className="text-xs px-2 py-1 rounded-full bg-[#ff880020] text-[#ff8800]">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <QuickPDFGenerator 
            resumeId={resumeId}
            title={resumeData.title}
            variant="outline"
            size="sm"
          />

          <Button
            variant="outline"
            onClick={() => handleUpdate('DRAFT')}
            disabled={isSaving}
            className="flex-1 sm:flex-none bg-[#2a2b2b] border-[#2a2b2b] text-white hover:bg-[#3a3b3b] transition-all"
          >
            {isSaving && savingType === 'draft' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
          
          {initialStatus !== 'ACTIVE' && (
            <Button
              onClick={() => handleUpdate('ACTIVE')}
              disabled={isSaving}
              className="flex-1 sm:flex-none bg-[#50a3f8] text-white border-[#50a3f8] hover:bg-[#4090e0] transition-all shadow-lg"
            >
              {isSaving && savingType === 'publish' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
        {/* Form */}
        <div className={showPreview ? '' : 'max-w-4xl mx-auto w-full'}>
          <ResumeForm 
            data={resumeData} 
            onChange={setResumeData}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-36 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto">
            <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Live Preview
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-[#2fabb820] text-[#2fabb8]">
                  Auto-updating
                </span>
              </div>
              <ResumePreview 
                data={resumeData}
                templateStructure={templateStructure}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}