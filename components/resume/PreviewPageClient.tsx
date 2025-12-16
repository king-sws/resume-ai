/* eslint-disable @typescript-eslint/no-explicit-any */
// components/resume/PreviewPageClient.tsx
'use client'

import { ArrowLeft, Download, Share2, Printer, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ResumePreviewClient } from './ResumePreviewClient'

interface PreviewPageClientProps {
  resumeId: string
  resumeTitle: string
  resumeData: any
  templateStructure?: any
}

export function PreviewPageClient({ 
  resumeId, 
  resumeTitle, 
  resumeData, 
  templateStructure 
}: PreviewPageClientProps) {
  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/resumes/${resumeId}`}>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#7e7e7e] hover:text-white hover:bg-[#2a2b2b]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div className="h-6 w-px bg-[#2a2b2b]" />
            <div>
              <h1 className="text-xl font-bold text-white">
                {resumeTitle}
              </h1>
              <p className="text-sm text-[#7e7e7e]">
                Preview Mode
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="border-[#2a2b2b] text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b] hover:text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Link href={`/dashboard/resumes/${resumeId}/download`}>
              <Button
                size="sm"
                className="bg-[#50a3f8] hover:bg-[#4090e0] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2a2b2b] text-[#7e7e7e] bg-transparent hover:bg-[#2a2b2b] hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-lg border border-[#50a3f820] bg-[#50a3f810] p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-[#50a3f8] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#50a3f8]">
                Preview Mode
              </p>
              <p className="text-xs text-[#7e7e7e] mt-1">
                This is how your resume will appear when downloaded or printed. Use the toolbar above to download as PDF or return to the editor to make changes.
              </p>
            </div>
          </div>
        </div>

        {/* Resume Preview */}
        <ResumePreviewClient 
          data={resumeData}
          templateStructure={templateStructure}
        />
      </div>
    </div>
  )
}