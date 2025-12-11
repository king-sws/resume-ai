// components/applications/ApplicationForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Resume {
  id: string
  title: string
  status: string
}

interface ApplicationFormProps {
  resumes: Resume[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
  applicationId?: string
}

export function ApplicationForm({ resumes, initialData, applicationId }: ApplicationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    location: initialData?.location || '',
    jobUrl: initialData?.jobUrl || '',
    salary: initialData?.salary || '',
    status: initialData?.status || 'WISHLIST',
    priority: initialData?.priority || 3,
    resumeId: initialData?.resumeId || (resumes[0]?.id || ''),
    notes: initialData?.notes || '',
    coverLetter: initialData?.coverLetter || '',
    recruiterName: initialData?.recruiterName || '',
    recruiterEmail: initialData?.recruiterEmail || '',
    source: initialData?.source || '',
    deadlineDate: initialData?.deadlineDate ? new Date(initialData.deadlineDate).toISOString().split('T')[0] : '',
    interviewDate: initialData?.interviewDate ? new Date(initialData.interviewDate).toISOString().split('T')[0] : '',
    screeningDate: initialData?.screeningDate ? new Date(initialData.screeningDate).toISOString().split('T')[0] : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = applicationId 
        ? `/api/applications/${applicationId}` 
        : '/api/applications'
      
      const method = applicationId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          deadlineDate: formData.deadlineDate || null,
          interviewDate: formData.interviewDate || null,
          screeningDate: formData.screeningDate || null,
          priority: parseInt(formData.priority.toString()),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save application')
      }

      router.push('/dashboard/applications')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
        <h2 className="text-xl font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="Google, Microsoft, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="Software Engineer, Product Manager, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="San Francisco, CA / Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="$100k - $150k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Job URL
            </label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            >
              <option value="">Select source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Company Website">Company Website</option>
              <option value="Referral">Referral</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
        <h2 className="text-xl font-semibold text-white">Application Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            >
              <option value="WISHLIST">Wishlist</option>
              <option value="APPLIED">Applied</option>
              <option value="SCREENING">Screening</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            >
              <option value="1">🔥 High Priority</option>
              <option value="2">⭐ Medium Priority</option>
              <option value="3">📌 Normal</option>
              <option value="4">💤 Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Resume Used *
            </label>
            <select
              name="resumeId"
              value={formData.resumeId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            >
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Important Dates */}
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
        <h2 className="text-xl font-semibold text-white">Important Dates</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Screening Date
            </label>
            <input
              type="date"
              name="screeningDate"
              value={formData.screeningDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Interview Date
            </label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Response Deadline
            </label>
            <input
              type="date"
              name="deadlineDate"
              value={formData.deadlineDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
        <h2 className="text-xl font-semibold text-white">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Recruiter Name
            </label>
            <input
              type="text"
              name="recruiterName"
              value={formData.recruiterName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Recruiter Email
            </label>
            <input
              type="email"
              name="recruiterEmail"
              value={formData.recruiterEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
              placeholder="recruiter@company.com"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="p-6 rounded-xl border border-[#2a2b2b] bg-[#242525] space-y-6">
        <h2 className="text-xl font-semibold text-white">Additional Notes</h2>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8] resize-none"
            placeholder="Any additional notes about this application..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 bg-[#2a2b2b] border border-[#3a3b3b] rounded-lg text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8] resize-none"
            placeholder="Your cover letter content..."
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20">
          <p className="text-sm text-[#ef4444]">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/applications">
          <Button
            type="button"
            variant="outline"
            className="border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={loading}
          className="bg-linear-to-r from-[#50a3f8] to-[#2fabb8] hover:opacity-90 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {applicationId ? 'Update' : 'Save'} Application
            </>
          )}
        </Button>
      </div>
    </form>
  )
}