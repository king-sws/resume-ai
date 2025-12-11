// app/dashboard/applications/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Briefcase, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const params = await searchParams

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId: session.user.id }
  
  if (params.status && ['WISHLIST', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(params.status)) {
    where.status = params.status
  }

  if (params.search) {
    where.OR = [
      { company: { contains: params.search, mode: 'insensitive' } },
      { position: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  // Fetch applications with resume data
  const applications = await prisma.jobApplication.findMany({
    where,
    include: {
      resume: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [
      { priority: 'asc' },
      { appliedAt: 'desc' },
    ],
  })

  // Get status counts
  const statusCounts = await prisma.jobApplication.groupBy({
    by: ['status'],
    where: { userId: session.user.id },
    _count: true,
  })

  const stats = statusCounts.reduce((acc, item) => {
    acc[item.status] = item._count
    return acc
  }, {} as Record<string, number>)

  // Calculate statistics
  const totalApplications = applications.length
  const activeApplications = applications.filter(a => 
    !['REJECTED', 'WITHDRAWN', 'ACCEPTED'].includes(a.status)
  ).length
  const interviewRate = totalApplications > 0 
    ? ((stats.INTERVIEW || 0) / totalApplications) * 100 
    : 0
  const offerRate = totalApplications > 0 
    ? ((stats.OFFER || 0) / totalApplications) * 100 
    : 0

  const summaryStats = {
    total: totalApplications,
    active: activeApplications,
    wishlist: stats.WISHLIST || 0,
    applied: stats.APPLIED || 0,
    screening: stats.SCREENING || 0,
    interview: stats.INTERVIEW || 0,
    offer: stats.OFFER || 0,
    accepted: stats.ACCEPTED || 0,
    rejected: stats.REJECTED || 0,
    withdrawn: stats.WITHDRAWN || 0,
    interviewRate,
    offerRate,
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Job Applications
            </h1>
            <p className="mt-2 text-base text-[#9ca3af]">
              Track and manage your job search journey
            </p>
          </div>
          
          <Link href="/dashboard/applications/new" className="sm:shrink-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold bg-[#50a3f8] hover:bg-[#3d8dd9] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Application
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#50a3f8] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Total Applications
                </p>
                <p className="text-3xl font-bold tracking-tight text-white">
                  {summaryStats.total}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Briefcase className="w-5 h-5 text-[#50a3f8]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#f59e0b] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Active
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#f59e0b]">
                  {summaryStats.active}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <Clock className="w-5 h-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#10b981] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Interview Rate
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#10b981]">
                  {summaryStats.interviewRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <TrendingUp className="w-5 h-5 text-[#10b981]" />
              </div>
            </div>
          </div>

          <div className="relative p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] transition-all duration-200 hover:scale-[1.02] cursor-pointer group overflow-hidden">
            <div className="absolute inset-0 bg-[#8b5cf6] opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 text-[#9ca3af]">
                  Offer Rate
                </p>
                <p className="text-3xl font-bold tracking-tight text-[#8b5cf6]">
                  {summaryStats.offerRate.toFixed(0)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#2a2b2b]">
                <CheckCircle2 className="w-5 h-5 text-[#8b5cf6]" />
              </div>
            </div>
          </div>
        </div>

        {/* Client Component */}
        <ApplicationsClient
          applications={applications}
          stats={summaryStats}
          currentStatus={params.status}
          currentSearch={params.search}
        />
      </div>
    </div>
  )
}