// app/dashboard/resumes/new/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { ResumeBuilder } from '@/components/resume/ResumeBuilder'
import { Sparkles, FileText, Zap, ArrowLeft } from 'lucide-react'
import { TemplateSelector } from '@/components/resume/TemplateSelector'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  searchParams: Promise<{
    template?: string
  }>
}

export default async function NewResumePage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const params = await searchParams
  const templateId = params.template

  // Fetch user data and resume count in parallel
  const [user, resumeCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usageStats: true },
    }),
    prisma.resume.count({
      where: { userId: session.user.id },
    })
  ])

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Determine resume limit
  const limit = user.usageStats?.resumesLimit || (user.plan === 'PRO' ? -1 : 1)
  
  // Check if user has reached resume limit
  if (user.plan === 'FREE' && limit !== -1 && resumeCount >= limit) {
    redirect('/dashboard/upgrade')
  }

  const isPro = user.plan === 'PRO' || user.plan === 'ENTERPRISE'

  // If no template selected, show template selector
  if (!templateId) {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: [
        { isPremium: 'asc' }, // Free first
        { usageCount: 'desc' },
      ],
      take: 12,
    })

    // Map DB template shape to UI Template shape
    const mappedTemplates = templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? '',
      category: String(t.category),
      isPremium: t.isPremium,
      previewImage: t.previewUrl ?? t.thumbnail ?? null,
      thumbnail: t.thumbnail ?? null,
      usageCount: t.usageCount,
    }))

    return (
      <div className="min-h-screen bg-[#191a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7e7e7e] hover:text-white hover:bg-[#2a2b2b] transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-6 sm:p-8 mb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-[#50a3f8]/20 text-[#50a3f8] shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Create New Resume
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#7e7e7e]">
                  Start with a professional template or create from scratch
                </p>
              </div>
            </div>
          </div>

          <TemplateSelector
            templates={mappedTemplates}
            isPro={isPro}
          />
        </div>
      </div>
    )
  }

  // Fetch selected template with all details
  const selectedTemplate = await prisma.template.findUnique({
    where: { id: templateId },
  })

  if (!selectedTemplate || !selectedTemplate.isActive) {
    redirect('/dashboard/resumes/new')
  }

  // Check if user can use premium template
  if (selectedTemplate.isPremium && !isPro) {
    redirect('/dashboard/upgrade')
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header Section */}
        <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-6 sm:p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-[#50a3f8]/20 text-[#50a3f8] shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Create New Resume
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#7e7e7e]">
                Build your professional resume with AI-powered assistance
              </p>
              
              {/* Features badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-[#2a2b2b] text-[#50a3f8]">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  AI-Powered
                </span>
                <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-[#2a2b2b] text-[#2fabb8]">
                  <Zap className="w-3 h-3 mr-1.5" />
                  Real-time Preview
                </span>
                {selectedTemplate && (
                  <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-[#2a2b2b] text-[#9ca3af]">
                    Template: {selectedTemplate.name}
                  </span>
                )}
                <span className="inline-flex items-center text-xs px-3 py-1.5 rounded-full bg-[#2a2b2b] text-[#7e7e7e]">
                  Resume {resumeCount + 1} of {limit === -1 ? '∞' : limit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Builder */}
        <ResumeBuilder 
          userId={session.user.id}
          templateId={templateId}
          templateData={selectedTemplate}
        />
      </div>
    </div>
  )
}