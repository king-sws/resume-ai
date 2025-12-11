/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// components/dashboard/ResumeCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MoreVertical, 
  Edit, 
  Download, 
  Trash2, 
  Copy,
  Eye,
  FileText,
  Calendar,
  Share2,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Resume {
  id: string
  title: string
  description: string | null
  status: string
  updatedAt: Date
  viewCount: number
  downloadCount: number
  aiScore: number | null
  template?: {
    name: string
    thumbnail: string | null
  } | null
}

interface ResumeCardProps {
  resume: Resume
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/resume/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id }),
      })

      if (!response.ok) throw new Error('Failed to delete resume')

      toast.success('Resume deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete resume')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/resume/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: resume.id }),
      })

      if (!response.ok) throw new Error('Failed to duplicate resume')

      toast.success('Resume duplicated successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to duplicate resume')
      console.error(error)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.id}`)
      toast.success('Link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const statusConfig = {
    DRAFT: { 
      bg: 'bg-[#f59e0b10]', 
      color: 'text-[#f59e0b]', 
      border: 'border-[#f59e0b30]',
      label: 'Draft'
    },
    ACTIVE: { 
      bg: 'bg-[#2fabb820]', 
      color: 'text-[#2fabb8]', 
      border: 'border-[#2fabb840]',
      label: 'Active'
    },
    ARCHIVED: { 
      bg: 'bg-[#6b728015]', 
      color: 'text-[#9ca3af]', 
      border: 'border-[#6b728030]',
      label: 'Archived'
    },
  }

  const status = statusConfig[resume.status as keyof typeof statusConfig] || statusConfig.DRAFT

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#2fabb8]'
    if (score >= 60) return 'text-[#50a3f8]'
    return 'text-[#9ca3af]'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-[#2fabb8]'
    if (score >= 60) return 'bg-[#50a3f8]'
    return 'bg-[#9ca3af]'
  }

  return (
    <>
      <div 
        className={`
          group relative rounded-xl border transition-all duration-300
          ${isHovered ? 'border-[#50a3f8] -translate-y-1' : 'border-[#2a2b2b]'}
          bg-[#242525]
        `}
        style={{
          boxShadow: isHovered ? '0 20px 40px rgba(80, 163, 248, 0.15)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Border Effect on Hover */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #50a3f8, #2fabb8)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />

        {/* Card Content */}
        <Link href={`/dashboard/resumes/${resume.id}`} className="block p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br from-[#50a3f8] to-[#2fabb8]">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className={`text-lg font-semibold truncate transition-colors duration-200 ${
                    isHovered ? 'text-[#50a3f8]' : 'text-white'
                  }`}
                >
                  {resume.title}
                </h3>
                {resume.template && (
                  <p className="text-xs mt-0.5 text-[#9ca3af]">
                    {resume.template.name} template
                  </p>
                )}
              </div>
            </div>
            <span 
              className={`px-2.5 py-1 text-xs font-medium rounded-md border shrink-0 ${status.bg} ${status.color} ${status.border}`}
            >
              {status.label}
            </span>
          </div>

          {/* Description */}
          {resume.description && (
            <p className="text-sm line-clamp-2 mb-4 text-[#9ca3af]">
              {resume.description}
            </p>
          )}

          {/* AI Score */}
          {resume.aiScore !== null && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-3 h-3 ${getScoreColor(resume.aiScore)}`} />
                  <span className="text-[#9ca3af]">AI Quality Score</span>
                </div>
                <span className={`font-bold ${getScoreColor(resume.aiScore)}`}>
                  {resume.aiScore}/100
                </span>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden bg-[#2a2b2b]">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBg(resume.aiScore)}`}
                  style={{ width: `${resume.aiScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-[#2a2b2b]">
              <div className="flex items-center space-x-2">
                <Eye className="w-3.5 h-3.5 text-[#50a3f8]" />
                <div>
                  <p className="text-xs font-semibold text-white">
                    {resume.viewCount}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    Views
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#2a2b2b]">
              <div className="flex items-center space-x-2">
                <Download className="w-3.5 h-3.5 text-[#2fabb8]" />
                <div>
                  <p className="text-xs font-semibold text-white">
                    {resume.downloadCount}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    Downloads
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Date */}
          <div className="flex items-center space-x-1.5 text-xs text-[#9ca3af]">
            <Calendar className="w-3 h-3" />
            <span>Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}</span>
          </div>
        </Link>

        {/* Actions Menu */}
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#2a2b2b] text-[#9ca3af] hover:bg-[#3a3b3b] hover:text-white"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-[#242525] border-[#2a2b2b]"
            >
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/resumes/${resume.id}`} 
                  className="cursor-pointer flex items-center text-white hover:bg-[#2a2b2b]"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Resume
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/resumes/${resume.id}/preview`} 
                  className="cursor-pointer flex items-center text-white hover:bg-[#2a2b2b]"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={handleShare}
                className="cursor-pointer text-white hover:bg-[#2a2b2b]"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#2a2b2b]" />
              
              <DropdownMenuItem 
                onClick={handleDuplicate}
                className="cursor-pointer text-white hover:bg-[#2a2b2b]"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  href={`/dashboard/resumes/${resume.id}/download`} 
                  className="cursor-pointer flex items-center text-white hover:bg-[#2a2b2b]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#2a2b2b]" />
              
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-[#ff4444] hover:bg-[#ff444410] focus:bg-[#ff444410] focus:text-[#ff4444]"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#242525] border-[#2a2b2b]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Resume
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#9ca3af]">
              Are you sure you want to delete "{resume.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-[#2a2b2b] text-white border-[#2a2b2b] hover:bg-[#3a3b3b]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-[#ff4444] text-white hover:bg-[#dd3333]"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}