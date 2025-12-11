// app/dashboard/resumes/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Filter, FileText, CheckCircle2, Edit3, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import prisma from '@/lib/db'
import { ResumeFilters } from '@/components/dashboard/ResumeFilters'

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function ResumesPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Await searchParams to fix the Next.js 15 issue
  const params = await searchParams

  // Build where clause based on filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId: session.user.id }
  
  if (params.status && ['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(params.status)) {
    where.status = params.status
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  // Fetch resumes
  const resumes = await prisma.resume.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      template: {
        select: {
          id: true,
          name: true,
          thumbnail: true,
        },
      },
    },
  })

  // Get stats for filters
  const [totalCount, draftCount, activeCount, archivedCount] = await Promise.all([
    prisma.resume.count({ where: { userId: session.user.id } }),
    prisma.resume.count({ where: { userId: session.user.id, status: 'DRAFT' } }),
    prisma.resume.count({ where: { userId: session.user.id, status: 'ACTIVE' } }),
    prisma.resume.count({ where: { userId: session.user.id, status: 'ARCHIVED' } }),
  ])

  const stats = {
    all: totalCount,
    draft: draftCount,
    active: activeCount,
    archived: archivedCount,
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              My Resumes
            </h1>
            <p className="mt-2 text-base text-[#9ca3af]">
              Create, manage, and optimize your professional resumes
            </p>
          </div>
          
          <Link href="/dashboard/resumes/new" className="sm:shrink-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold bg-[#50a3f8] hover:bg-[#3d8dd9] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Enhanced Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Resumes */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#50a3f8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Total Resumes
                </p>
                <p className="text-3xl font-bold tracking-tight text-white">
                  {stats.all}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <FileText className="w-5 h-5 text-[#50a3f8]" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#2fabb8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Active
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#2fabb8]">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <CheckCircle2 className="w-5 h-5 text-[#2fabb8]" />
              </div>
            </div>
          </div>

          {/* Drafts */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#f59e0b] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Drafts
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#f59e0b]">
                  {stats.draft}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Edit3 className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          {/* Archived */}
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#6b7280] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Archived
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#9ca3af]">
                  {stats.archived}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Archive className="w-5 h-5 text-[#6b7280]" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ResumeFilters 
          stats={stats} 
          currentStatus={params.status}
          currentSearch={params.search}
        />

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          params.status || params.search ? (
            <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-12 text-center">
              <div className="inline-flex p-4 rounded-full mb-4 bg-[#2a2b2b]">
                <Filter className="w-8 h-8 text-[#9ca3af]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                No resumes found
              </h3>
              <p className="mb-6 max-w-md mx-auto text-[#9ca3af]">
                No resumes match your current filters. Try adjusting your search criteria or clear all filters.
              </p>
              <Link href="/dashboard/resumes">
                <Button 
                  variant="outline"
                  className="transition-all duration-200 hover:scale-[1.02] border-[#2a2b2b] text-[#9ca3af] bg-transparent hover:bg-[#2a2b2b]"
                >
                  Clear All Filters
                </Button>
              </Link>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}