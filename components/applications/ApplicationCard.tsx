// components/applications/ApplicationCard.tsx
'use client'

import Link from 'next/link'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText,
  ExternalLink,
  MoreVertical,
  Star
} from 'lucide-react'

interface Application {
  id: string
  company: string
  position: string
  location: string | null
  status: string
  appliedAt: Date
  salary: string | null
  priority: number
  jobUrl: string | null
  interviewDate: Date | null
  offerDate: Date | null
  deadlineDate: Date | null
  resume: {
    id: string
    title: string
  }
}

interface ApplicationCardProps {
  application: Application
  compact?: boolean
}

const statusColors: Record<string, string> = {
  WISHLIST: 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20',
  APPLIED: 'bg-[#50a3f8]/10 text-[#50a3f8] border-[#50a3f8]/20',
  SCREENING: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
  INTERVIEW: 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20',
  OFFER: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
  ACCEPTED: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20',
  REJECTED: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
  WITHDRAWN: 'bg-[#6b7280]/10 text-[#6b7280] border-[#6b7280]/20',
}

export function ApplicationCard({ application, compact = false }: ApplicationCardProps) {
  const statusColor = statusColors[application.status] || statusColors.APPLIED

  const getNextDate = () => {
    if (application.deadlineDate) return { label: 'Deadline', date: application.deadlineDate }
    if (application.interviewDate) return { label: 'Interview', date: application.interviewDate }
    if (application.offerDate) return { label: 'Offer', date: application.offerDate }
    return null
  }

  const nextDate = getNextDate()

  if (compact) {
    return (
      <Link
        href={`/dashboard/applications/${application.id}`}
        className="block p-4 rounded-lg bg-[#2a2b2b] hover:bg-[#3a3b3b] transition-all border border-[#3a3b3b] hover:border-[#50a3f8]/30"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white text-sm line-clamp-1">
            {application.position}
          </h3>
          {application.priority <= 2 && (
            <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b] shrink-0" />
          )}
        </div>
        
        <p className="text-sm text-[#9ca3af] mb-3 line-clamp-1 flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          {application.company}
        </p>

        {application.salary && (
          <p className="text-xs text-[#9ca3af] mb-2 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {application.salary}
          </p>
        )}

        {nextDate && (
          <div className="text-xs text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-1 rounded">
            {nextDate.label}: {new Date(nextDate.date).toLocaleDateString()}
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/dashboard/applications/${application.id}`}
      className="block p-6 rounded-xl bg-[#242525] border border-[#2a2b2b] hover:bg-[#2a2b2b] transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-[#50a3f8] transition-colors">
              {application.position}
            </h3>
            {application.priority <= 2 && (
              <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
            )}
          </div>
          <p className="text-[#9ca3af] flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            {application.company}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            {application.status.replace('_', ' ')}
          </span>
          <button className="p-2 hover:bg-[#3a3b3b] rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-[#9ca3af]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {application.location && (
          <div className="flex items-center gap-2 text-[#9ca3af]">
            <MapPin className="w-4 h-4" />
            <span>{application.location}</span>
          </div>
        )}

        {application.salary && (
          <div className="flex items-center gap-2 text-[#9ca3af]">
            <DollarSign className="w-4 h-4" />
            <span>{application.salary}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[#9ca3af]">
          <Calendar className="w-4 h-4" />
          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-[#9ca3af]">
          <FileText className="w-4 h-4" />
          <span className="truncate">{application.resume.title}</span>
        </div>
      </div>

      {nextDate && (
        <div className="mt-4 p-3 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
          <p className="text-sm text-[#f59e0b] font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {nextDate.label}: {new Date(nextDate.date).toLocaleDateString()}
          </p>
        </div>
      )}

      {application.jobUrl && (
        <div className="mt-4">
          <Link
            href={application.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-sm text-[#50a3f8] hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View Job Posting
          </Link>
        </div>
      )}
    </Link>
  )
}