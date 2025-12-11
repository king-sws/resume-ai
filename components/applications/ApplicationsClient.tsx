// components/applications/ApplicationsClient.tsx
'use client'

import { useState } from 'react'
import { ApplicationFilters } from './ApplicationFilters'
import { Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ApplicationCard } from './ApplicationCard'

interface Application {
  id: string
  company: string
  position: string
  location: string | null
  status: string
  appliedAt: Date
  salary: string | null
  priority: number
  notes: string | null
  jobUrl: string | null
  screeningDate: Date | null
  interviewDate: Date | null
  offerDate: Date | null
  deadlineDate: Date | null
  resume: {
    id: string
    title: string
  }
}

interface Stats {
  total: number
  active: number
  wishlist: number
  applied: number
  screening: number
  interview: number
  offer: number
  accepted: number
  rejected: number
  withdrawn: number
  interviewRate: number
  offerRate: number
}

interface ApplicationsClientProps {
  applications: Application[]
  stats: Stats
  currentStatus?: string
  currentSearch?: string
}

export function ApplicationsClient({
  applications,
  stats,
  currentStatus,
  currentSearch,
}: ApplicationsClientProps) {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('list')

  // Group applications by status for board view
  const groupedApplications = {
    WISHLIST: applications.filter(a => a.status === 'WISHLIST'),
    APPLIED: applications.filter(a => a.status === 'APPLIED'),
    SCREENING: applications.filter(a => a.status === 'SCREENING'),
    INTERVIEW: applications.filter(a => a.status === 'INTERVIEW'),
    OFFER: applications.filter(a => a.status === 'OFFER'),
    ACCEPTED: applications.filter(a => a.status === 'ACCEPTED'),
    REJECTED: applications.filter(a => a.status === 'REJECTED'),
    WITHDRAWN: applications.filter(a => a.status === 'WITHDRAWN'),
  }

  const columns = [
    { key: 'WISHLIST', title: 'Wishlist', color: 'bg-[#6b7280]' },
    { key: 'APPLIED', title: 'Applied', color: 'bg-[#50a3f8]' },
    { key: 'SCREENING', title: 'Screening', color: 'bg-[#f59e0b]' },
    { key: 'INTERVIEW', title: 'Interview', color: 'bg-[#8b5cf6]' },
    { key: 'OFFER', title: 'Offer', color: 'bg-[#10b981]' },
  ]

  return (
    <>
      {/* Filters */}
      <ApplicationFilters
        stats={stats}
        currentStatus={currentStatus}
        currentSearch={currentSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {applications.length === 0 ? (
        <div className="rounded-xl border border-[#2a2b2b] bg-[#242525] p-12 text-center">
          <div className="inline-flex p-4 rounded-full mb-4 bg-[#2a2b2b]">
            <Briefcase className="w-8 h-8 text-[#9ca3af]" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            {currentStatus || currentSearch ? 'No applications found' : 'No applications yet'}
          </h3>
          <p className="mb-6 max-w-md mx-auto text-[#9ca3af]">
            {currentStatus || currentSearch
              ? 'No applications match your current filters. Try adjusting your search criteria.'
              : 'Start tracking your job applications to manage your job search effectively.'}
          </p>
          <Link href={currentStatus || currentSearch ? '/dashboard/applications' : '/dashboard/applications/new'}>
            <Button className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white">
              {currentStatus || currentSearch ? 'Clear Filters' : 'Add First Application'}
            </Button>
          </Link>
        </div>
      ) : viewMode === 'board' ? (
        // Kanban Board View
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => (
              <div
                key={column.key}
                className="shrink-0 w-80 rounded-xl border border-[#2a2b2b] bg-[#242525] p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-white">{column.title}</h3>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[#2a2b2b] text-xs font-semibold text-[#9ca3af]">
                    {groupedApplications[column.key as keyof typeof groupedApplications].length}
                  </span>
                </div>
                <div className="space-y-3 max-h-[calc(100vh-24rem)] overflow-y-auto">
                  {groupedApplications[column.key as keyof typeof groupedApplications].map((app) => (
                    <ApplicationCard key={app.id} application={app} compact />
                  ))}
                  {groupedApplications[column.key as keyof typeof groupedApplications].length === 0 && (
                    <p className="text-sm text-[#6b7280] text-center py-8">
                      No applications
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </>
  )
}