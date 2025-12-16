/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/resumes/[id]/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { 
  ArrowLeft, 
  Edit3, 
  Eye, 
  Download, 
  Share2, 
  Calendar, 
  TrendingUp,
  Clock,
  FileText,
  Sparkles,
  Archive,
  CheckCircle2,
  FolderClosed
} from 'lucide-react'
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

// Calculate time ago
const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
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
          category: true,
          structure: true
        }
      }
    }
  })

  if (!resume) {
    notFound()
  }

  const statusConfig = {
    DRAFT: { 
      bg: 'bg-[#f59e0b]/10', 
      text: 'text-[#f59e0b]', 
      border: 'border-[#f59e0b]/20',
      icon: Edit3,
      label: 'Draft' 
    },
    ACTIVE: { 
      bg: 'bg-[#2fabb8]/10', 
      text: 'text-[#2fabb8]', 
      border: 'border-[#2fabb8]/20',
      icon: CheckCircle2,
      label: 'Active' 
    },
    ARCHIVED: { 
      bg: 'bg-[#6b7280]/10', 
      text: 'text-[#6b7280]', 
      border: 'border-[#6b7280]/20',
      icon: Archive,
      label: 'Archived' 
    },
  }

  const status = statusConfig[resume.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  // Calculate completion percentage
  const calculateCompletion = () => {
    const data = resume.data as any
    let total = 0
    let filled = 0

    // Personal Info (6 fields)
    const personalFields = ['fullName', 'email', 'phone', 'location', 'linkedin', 'website']
    personalFields.forEach(field => {
      total++
      if (data.personalInfo?.[field]) filled++
    })

    // Summary
    total++
    if (data.summary) filled++

    // Experience (at least 1)
    total++
    if (data.experience?.length > 0) filled++

    // Education (at least 1)
    total++
    if (data.education?.length > 0) filled++

    // Skills (at least 1)
    total++
    if (data.skills?.length > 0) filled++

    return Math.round((filled / total) * 100)
  }

  const completionPercentage = calculateCompletion()

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Navigation */}
        <Link href="/dashboard/resumes">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#7e7e7e] hover:text-white hover:bg-[#2a2b2b] transition-all mb-5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resumes
          </Button>
        </Link>

        {/* Enhanced Header Card */}
        <div className="rounded-xl border border-[#2a2b2b] bg-linear-to-br from-[#242525] to-[#1f2020] p-6 sm:p-8 shadow-xl">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br from-[#50a3f8] to-[#2fabb8] shadow-lg">
                  <FolderClosed className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                      {resume.title}
                    </h1>
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${status.bg} ${status.text} ${status.border} border`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{status.label}</span>
                    </span>
                  </div>
                  
                  {resume.description && (
                    <p className="text-sm sm:text-base text-[#9ca3af] mb-4 line-clamp-2">
                      {resume.description}
                    </p>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[#7e7e7e]">
                    {resume.template && (
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#50a3f8]" />
                        <span className="text-[#50a3f8] font-medium">{resume.template.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(resume.updatedAt)}</span>
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
                  className="border-[#2a2b2b] text-[#9ca3af] bg-transparent hover:bg-[#2a2b2b] hover:text-white hover:border-[#50a3f8]/30 transition-all"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <Link href={`/dashboard/resumes/${resume.id}/download`}>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-[#2a2b2b] text-[#9ca3af] bg-transparent hover:bg-[#2a2b2b] hover:text-white hover:border-[#2fabb8]/30 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="sm"
                className="border-[#2a2b2b] text-[#9ca3af] bg-transparent hover:bg-[#2a2b2b] hover:text-white transition-all"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Completion Progress */}
          <div className="mb-6 p-4 rounded-lg bg-[#2a2b2b]/50 border border-[#2a2b2b]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#9ca3af]">Profile Completion</span>
              <span className="text-sm font-bold text-white">{completionPercentage}%</span>
            </div>
            <div className="h-2 bg-[#191a1a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-[#50a3f8] to-[#2fabb8] rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage < 100 && (
              <p className="text-xs text-[#7e7e7e] mt-2">
                Complete all sections to improve your resume quality
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-[#2a2b2b]">
            {/* Views */}
            <div className="group relative p-4 rounded-lg bg-[#2a2b2b]/30 hover:bg-[#2a2b2b]/60 transition-all cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#50a3f8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                    <Eye className="w-4 h-4 text-[#50a3f8]" />
                  </div>
                  <TrendingUp className="w-3 h-3 text-[#50a3f8] opacity-50" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {resume.viewCount}
                </p>
                <p className="text-xs text-[#7e7e7e]">Total Views</p>
              </div>
            </div>

            {/* Downloads */}
            <div className="group relative p-4 rounded-lg bg-[#2a2b2b]/30 hover:bg-[#2a2b2b]/60 transition-all cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#2fabb8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#2fabb8]/10">
                    <Download className="w-4 h-4 text-[#2fabb8]" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {resume.downloadCount}
                </p>
                <p className="text-xs text-[#7e7e7e]">Downloads</p>
              </div>
            </div>

            {/* AI Score */}
            {resume.aiScore !== null ? (
              <div className="group relative p-4 rounded-lg bg-[#2a2b2b]/30 hover:bg-[#2a2b2b]/60 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#50a3f8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-[#50a3f8]/10">
                      <Sparkles className="w-4 h-4 text-[#50a3f8]" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {resume.aiScore}
                    <span className="text-sm text-[#7e7e7e]">/100</span>
                  </p>
                  <p className="text-xs text-[#7e7e7e]">AI Score</p>
                </div>
              </div>
            ) : (
              <div className="group relative p-4 rounded-lg bg-[#2a2b2b]/30 hover:bg-[#2a2b2b]/60 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                      <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-[#f59e0b] mb-1">—</p>
                  <p className="text-xs text-[#7e7e7e]">No Score Yet</p>
                </div>
              </div>
            )}

            {/* Shares */}
            <div className="group relative p-4 rounded-lg bg-[#2a2b2b]/30 hover:bg-[#2a2b2b]/60 transition-all cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[#2fabb8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#2fabb8]/10">
                    <Share2 className="w-4 h-4 text-[#2fabb8]" />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {resume.shareCount}
                </p>
                <p className="text-xs text-[#7e7e7e]">Shares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Editor */}
        <ResumeEditor
          resumeId={resume.id}
          initialData={resume.data as any}
          initialTitle={resume.title}
          initialStatus={resume.status as 'DRAFT' | 'ACTIVE' | 'ARCHIVED'}
          templateStructure={resume.template?.structure}
        />
      </div>
    </div>
  )
}