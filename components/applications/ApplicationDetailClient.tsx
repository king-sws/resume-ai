/* eslint-disable @typescript-eslint/no-unused-vars */
// components/applications/ApplicationDetailClient.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  User,
  Mail,
  Globe,
  AlertCircle,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApplicationForm } from './ApplicationForm'

interface Resume {
  id: string
  title: string
  status: string
}

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
  coverLetter: string | null
  screeningDate: Date | null
  interviewDate: Date | null
  offerDate: Date | null
  deadlineDate: Date | null
  recruiterName: string | null
  recruiterEmail: string | null
  source: string | null
  resume: {
    id: string
    title: string
  }
}

interface ApplicationDetailClientProps {
  application: Application
  resumes: Resume[]
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

export function ApplicationDetailClient({ application, resumes }: ApplicationDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      router.push('/dashboard/applications')
      router.refresh()
    } catch (error) {
      alert('Failed to delete application')
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#191a1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Edit Application</h1>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
          <ApplicationForm 
            resumes={resumes} 
            initialData={application}
            applicationId={application.id}
          />
        </div>
      </div>
    )
  }

  const statusColor = statusColors[application.status] || statusColors.APPLIED

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard/applications">
            <Button
              variant="outline"
              className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b] hover:text-white/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[#50a3f8] hover:bg-[#3d8dd9] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="outline"
              className="border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Info Card */}
        <div className="p-8 rounded-xl border border-[#2a2b2b] bg-[#242525]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {application.position}
              </h1>
              <p className="text-xl text-[#9ca3af] flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {application.company}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {application.location && (
              <div>
                <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location
                </p>
                <p className="text-white font-medium">{application.location}</p>
              </div>
            )}

            {application.salary && (
              <div>
                <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Salary
                </p>
                <p className="text-white font-medium">{application.salary}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Applied
              </p>
              <p className="text-white font-medium">
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Resume
              </p>
              <Link 
                href={`/dashboard/resumes/${application.resume.id}`}
                className="text-[#50a3f8] hover:underline font-medium"
              >
                {application.resume.title}
              </Link>
            </div>
          </div>

          {application.jobUrl && (
            <div className="mt-6 pt-6 border-t border-[#2a2b2b]">
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#50a3f8] hover:underline"
              >
                <ExternalLink className="w-5 h-5" />
                View Job Posting
              </a>
            </div>
          )}
        </div>

        {/* Important Dates */}
        {(application.screeningDate || application.interviewDate || application.deadlineDate) && (
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <h2 className="text-xl font-semibold text-white mb-4">Important Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {application.screeningDate && (
                <div className="p-4 rounded-lg bg-[#2a2b2b]">
                  <p className="text-sm text-[#9ca3af] mb-1">Screening</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#f59e0b]" />
                    {new Date(application.screeningDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {application.interviewDate && (
                <div className="p-4 rounded-lg bg-[#2a2b2b]">
                  <p className="text-sm text-[#9ca3af] mb-1">Interview</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8b5cf6]" />
                    {new Date(application.interviewDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {application.deadlineDate && (
                <div className="p-4 rounded-lg bg-[#2a2b2b]">
                  <p className="text-sm text-[#9ca3af] mb-1">Deadline</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ef4444]" />
                    {new Date(application.deadlineDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {(application.recruiterName || application.recruiterEmail || application.source) && (
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {application.recruiterName && (
                <div>
                  <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Recruiter
                  </p>
                  <p className="text-white">{application.recruiterName}</p>
                </div>
              )}

              {application.recruiterEmail && (
                <div>
                  <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <a 
                    href={`mailto:${application.recruiterEmail}`}
                    className="text-[#50a3f8] hover:underline"
                  >
                    {application.recruiterEmail}
                  </a>
                </div>
              )}

              {application.source && (
                <div>
                  <p className="text-sm text-[#9ca3af] mb-1 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Source
                  </p>
                  <p className="text-white">{application.source}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {application.notes && (
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
            <p className="text-[#e5e7eb] whitespace-pre-wrap">{application.notes}</p>
          </div>
        )}

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525]">
            <h2 className="text-xl font-semibold text-white mb-4">Cover Letter</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-[#e5e7eb] whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}