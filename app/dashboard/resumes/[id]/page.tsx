/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/resumes/[id]/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { ArrowLeft, Edit3, Eye, Download, Share2, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Simple date formatter
const formatDate = (date: Date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date(date)
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default async function EditResumePage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Await params
  const { id } = await params

  // Fetch resume with additional details
  const resume = await prisma.resume.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      template: {
        select: {
          name: true,
          category: true
        }
      }
    }
  })

  if (!resume) {
    notFound()
  }

  const statusConfig = {
    DRAFT: { bg: '#7e7e7e20', color: '#7e7e7e', label: 'Draft' },
    ACTIVE: { bg: '#2fabb820', color: '#2fabb8', label: 'Active' },
    ARCHIVED: { bg: '#7e7e7e15', color: '#7e7e7e', label: 'Archived' },
  }

  const status = statusConfig[resume.status as keyof typeof statusConfig]

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: '#191a1a' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back Button */}
        <Link href="/dashboard/resumes">
          <Button 
            variant="ghost" 
            size="sm"
            className="mb-4"
            style={{ color: '#7e7e7e' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resumes
          </Button>
        </Link>

        {/* Header Card */}
        <div 
          className="rounded-xl border p-8"
          style={{ 
            backgroundColor: '#242525',
            borderColor: '#2a2b2b'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #50a3f8, #2fabb8)'
                  }}
                >
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold" style={{ color: '#ffffff' }}>
                      {resume.title}
                    </h1>
                    <span 
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: status.bg,
                        color: status.color
                      }}
                    >
                      {status.label}
                    </span>
                  </div>
                  {resume.description && (
                    <p className="text-base mb-3" style={{ color: '#7e7e7e' }}>
                      {resume.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#7e7e7e' }}>
                    {resume.template && (
                      <div className="flex items-center gap-1.5">
                        <span>Template:</span>
                        <span style={{ color: '#50a3f8' }}>{resume.template.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/resumes/${resume.id}/preview`}>
                <Button 
                  variant="outline"
                  size="sm"
                  style={{ 
                    borderColor: '#2a2b2b',
                    color: '#7e7e7e',
                    backgroundColor: 'transparent'
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Link href={`/dashboard/resumes/${resume.id}/download`}>
                <Button 
                  variant="outline"
                  size="sm"
                  style={{ 
                    borderColor: '#2a2b2b',
                    color: '#7e7e7e',
                    backgroundColor: 'transparent'
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="sm"
                style={{ 
                  borderColor: '#2a2b2b',
                  color: '#7e7e7e',
                  backgroundColor: 'transparent'
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: '#2a2b2b' }}>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#2a2b2b' }}
            >
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4" style={{ color: '#50a3f8' }} />
                <TrendingUp className="w-3 h-3" style={{ color: '#50a3f8' }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                {resume.viewCount}
              </p>
              <p className="text-xs" style={{ color: '#7e7e7e' }}>
                Total Views
              </p>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#2a2b2b' }}
            >
              <div className="flex items-center justify-between mb-2">
                <Download className="w-4 h-4" style={{ color: '#2fabb8' }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                {resume.downloadCount}
              </p>
              <p className="text-xs" style={{ color: '#7e7e7e' }}>
                Downloads
              </p>
            </div>

            {resume.aiScore !== null && (
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#2a2b2b' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-4 h-4" style={{ color: '#50a3f8' }} />
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                  {resume.aiScore}/100
                </p>
                <p className="text-xs" style={{ color: '#7e7e7e' }}>
                  AI Score
                </p>
              </div>
            )}

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: '#2a2b2b' }}
            >
              <div className="flex items-center justify-between mb-2">
                <Share2 className="w-4 h-4" style={{ color: '#2fabb8' }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
                {resume.shareCount}
              </p>
              <p className="text-xs" style={{ color: '#7e7e7e' }}>
                Shares
              </p>
            </div>
          </div>
        </div>

        {/* Resume Editor */}
        <ResumeEditor
          resumeId={resume.id}
          initialData={resume.data as any}
          initialTitle={resume.title}
          initialStatus={resume.status as 'DRAFT' | 'ACTIVE' | 'ARCHIVED'}
        />
      </div>
    </div>
  )
}