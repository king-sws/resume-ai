/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/ResumeBuilder.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResumeForm } from './ResumeForm'
import { ResumePreview } from './ResumePreview'
import { Button } from '@/components/ui/button'
import { Save, Eye, EyeOff, Loader2, Check, ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ResumeBuilderProps {
  userId: string
  templateId?: string
  templateData?: any
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

const initialResumeData: ResumeData = {
  title: 'Untitled Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

// Helper function to generate sample data based on template category
const generateSampleData = (templateName: string, templateCategory: string): Partial<ResumeData> => {
  const samples: Record<string, Partial<ResumeData>> = {
    MODERN: {
      personalInfo: {
        fullName: 'Your Full Name',
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'City, State',
        linkedin: 'linkedin.com/in/yourprofile',
        website: 'yourwebsite.com',
      },
      summary: 'Dynamic and results-oriented professional with expertise in...',
      experience: [
        {
          id: crypto.randomUUID(),
          company: 'Company Name',
          position: 'Your Position',
          location: 'City, State',
          startDate: '2020-01',
          endDate: '',
          current: true,
          description: '• Led key initiatives...\n• Managed team of...\n• Achieved measurable results...',
        },
      ],
      education: [
        {
          id: crypto.randomUUID(),
          school: 'University Name',
          degree: 'Bachelor of Science',
          field: 'Your Field',
          location: 'City, State',
          graduationDate: '2020-05',
          gpa: '3.8',
        },
      ],
      skills: [
        {
          id: crypto.randomUUID(),
          category: 'Technical Skills',
          items: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
        },
      ],
    },
    CLASSIC: {
      personalInfo: {
        fullName: 'Your Full Name',
        email: 'your.email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State',
        linkedin: '',
        website: '',
      },
      summary: 'Accomplished professional with proven track record in...',
      experience: [
        {
          id: crypto.randomUUID(),
          company: 'Company Name',
          position: 'Your Position',
          location: 'City, State',
          startDate: '2020-01',
          endDate: '',
          current: true,
          description: 'Key responsibilities and achievements...',
        },
      ],
      education: [
        {
          id: crypto.randomUUID(),
          school: 'University Name',
          degree: 'Degree',
          field: 'Field of Study',
          location: 'City, State',
          graduationDate: '2020-05',
          gpa: '',
        },
      ],
      skills: [
        {
          id: crypto.randomUUID(),
          category: 'Professional Skills',
          items: ['Skill 1', 'Skill 2', 'Skill 3'],
        },
      ],
    },
    CREATIVE: {
      personalInfo: {
        fullName: 'Your Full Name',
        email: 'hello@yourname.com',
        phone: '+1 555-123-4567',
        location: 'City, Country',
        linkedin: 'linkedin.com/in/yourname',
        website: 'portfolio.yourname.com',
      },
      summary: 'Creative professional passionate about innovative solutions...',
      projects: [
        {
          id: crypto.randomUUID(),
          name: 'Project Name',
          description: 'Brief description of your project and its impact...',
          technologies: 'Technology 1, Technology 2, Technology 3',
          link: 'github.com/yourproject',
        },
      ],
    },
    MINIMALIST: {
      personalInfo: {
        fullName: 'Your Name',
        email: 'email@example.com',
        phone: '555-123-4567',
        location: 'City',
        linkedin: '',
        website: '',
      },
      summary: 'Professional focused on delivering results.',
      experience: [
        {
          id: crypto.randomUUID(),
          company: 'Company',
          position: 'Position',
          location: 'Location',
          startDate: '2020-01',
          endDate: '',
          current: true,
          description: 'Key achievements and responsibilities.',
        },
      ],
    },
  }

  return samples[templateCategory] || samples.MODERN
}

export function ResumeBuilder({ userId, templateId, templateData }: ResumeBuilderProps) {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savingType, setSavingType] = useState<'draft' | 'publish' | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize resume data with template if available
  useEffect(() => {
    if (!isInitialized && templateData) {
      console.log('Template data received:', templateData)
      
      // Set the title from template name
      const title = templateData.name ? `${templateData.name} Resume` : 'Untitled Resume'
      
      // Generate sample data based on template category
      const sampleData = generateSampleData(
        templateData.name,
        templateData.category
      )
      
      // Merge with initial data
      const mergedData: ResumeData = {
        ...initialResumeData,
        ...sampleData,
        title,
      }
      
      console.log('Setting resume data:', mergedData)
      setResumeData(mergedData)
      setIsInitialized(true)
      
      // Show a toast to indicate template loaded
      toast.success(`${templateData.name} template loaded!`, {
        description: 'Fill in your information to create your resume',
      })
    }
  }, [templateData, isInitialized])

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

  const handleSave = async (status: 'DRAFT' | 'ACTIVE') => {
    setSaveError(null)
    setSavingType(status === 'DRAFT' ? 'draft' : 'publish')
    
    // Validate before saving
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
          title: resumeData.title,
          data: resumeData,
          status,
          templateId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          toast.error(result.message || 'Resume limit reached')
          router.push('/dashboard/upgrade')
          return
        }
        
        if (response.status === 400) {
          const errorMessage = result.details 
            ? `Validation error: ${result.details.map((d: any) => d.message).join(', ')}`
            : result.error || 'Invalid resume data'
          throw new Error(errorMessage)
        }
        
        throw new Error(result.error || 'Failed to save resume')
      }

      if (!result.success || !result.resume) {
        throw new Error('Invalid response from server')
      }

      toast.success(
        status === 'ACTIVE' 
          ? 'Resume published successfully!' 
          : 'Resume saved as draft!'
      )
      
      router.push(`/dashboard/resumes/${result.resume.id}`)
      router.refresh()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save resume'
      console.error('Error saving resume:', error)
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

      {/* Template Info Banner (shown when template is loaded) */}
      {templateData && isInitialized && (
        <div className="rounded-lg border border-[#50a3f820] bg-[#50a3f810] p-4 flex items-start space-x-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#50a3f8]">
              Using "{templateData.name}" template
            </p>
            <p className="text-xs text-[#7e7e7e] mt-1">
              Sample content has been pre-filled. Replace it with your own information.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 sticky top-20 z-30 shadow-lg">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#7e7e7e] bg-transparent hover:text-white hover:bg-[#2a2b2b] transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
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
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="flex-1 sm:flex-none bg-[#2a2b2b] border-[#2a2b2b] text-white hover:bg-[#3a3b3b] transition-all"
          >
            {isSaving && savingType === 'draft' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Draft...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleSave('ACTIVE')}
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
                Save & Publish
              </>
            )}
          </Button>
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
                templateStructure={templateData?.structure}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}