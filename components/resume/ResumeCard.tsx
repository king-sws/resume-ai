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
import { QuickPDFGenerator } from './QuickPDFGenerator'

interface Resume {
  id: string
  title: string
  description: string | null
  status: string
  updatedAt: Date
  viewCount: number
  downloadCount: number
  aiScore: number | null
}

interface ResumeCardProps {
  resume: Resume
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const statusColors = {
    DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    ARCHIVED: 'bg-slate-100 text-slate-800 border-slate-200',
  }

  return (
    <>
      <div className="group relative bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200">
        {/* Card Content */}
        <Link href={`/dashboard/resumes/${resume.id}`} className="block p-6">
          {/* Header with Icon and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {resume.title}
                </h3>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md border ${statusColors[resume.status as keyof typeof statusColors]}`}>
                  {resume.status}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {resume.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {resume.description}
            </p>
          )}

          {/* AI Score */}
          {resume.aiScore && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">AI Score</span>
                <span className="font-semibold text-slate-900">{resume.aiScore}/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    resume.aiScore >= 80 ? 'bg-green-500' :
                    resume.aiScore >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${resume.aiScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{resume.viewCount} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{resume.downloadCount}</span>
            </div>
          </div>

          {/* Updated Date */}
          <div className="flex items-center space-x-1 mt-3 text-xs text-slate-400">
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
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/resumes/${resume.id}`} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Resume
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/resumes/${resume.id}/preview`} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <div className="cursor-pointer">
                  <QuickPDFGenerator 
                    resumeId={resume.id}
                    title={resume.title}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start p-0 h-auto font-normal"
                  />
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600 cursor-pointer"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}