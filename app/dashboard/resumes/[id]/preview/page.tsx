// app/dashboard/resumes/[id]/preview/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { PreviewPageClient } from '@/components/resume/PreviewPageClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PreviewResumePage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const { id } = await params

  // Fetch resume with template details
  const resume = await prisma.resume.findFirst({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      template: {
        select: {
          name: true,
          category: true,
          structure: true,
        }
      }
    }
  })

  if (!resume) {
    notFound()
  }

  // Increment view count
  await prisma.resume.update({
    where: { id: resume.id },
    data: { viewCount: { increment: 1 } }
  })

  return (
    <PreviewPageClient 
      resumeId={resume.id}
      resumeTitle={resume.title}
      resumeData={resume.data}
      templateStructure={resume.template?.structure}
    />
  )
}