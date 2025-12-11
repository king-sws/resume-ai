/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/resumes/[id]/download/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { PDFDownloader } from '@/components/resume/PDFDownloader'
import { FileDown } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DownloadResumePage({ params }: PageProps) {
  // Await params to fix Next.js 15 async params requirement
  const { id } = await params
  
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch resume
  const resume = await prisma.resume.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      template: {
        select: {
          name: true,
          category: true
        }
      }
    }
  })

  if (!resume) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-[#242525] border border-[#2a2b2b] rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #50a3f8, #2fabb8)'
              }}
            >
              <FileDown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">
                Download Resume
              </h1>
              <p className="mt-2 text-base text-[#7e7e7e]">
                Choose your preferred format and customize download options
              </p>
            </div>
          </div>
        </div>

        {/* PDF Downloader */}
        <PDFDownloader
          resumeId={resume.id}
          resumeData={resume.data as any}
          title={resume.title}
        />
      </div>
    </div>
  )
}

