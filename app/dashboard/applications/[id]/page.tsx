// app/dashboard/applications/[id]/page.tsx
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { ApplicationDetailClient } from '@/components/applications/ApplicationDetailClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const { id } = await params

  const application = await prisma.jobApplication.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      resume: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  if (!application) {
    notFound()
  }

  // Get all resumes for editing
  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      status: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return <ApplicationDetailClient application={application} resumes={resumes} />
}