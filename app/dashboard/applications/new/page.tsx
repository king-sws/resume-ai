// app/dashboard/applications/new/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { ApplicationForm } from '@/components/applications/ApplicationForm'

export default async function NewApplicationPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Get user's resumes for selection
  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      status: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (resumes.length === 0) {
    redirect('/dashboard/resumes/new')
  }

  return (
    <div className="min-h-screen bg-[#191a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Add Job Application
          </h1>
          <p className="text-[#9ca3af]">
            Track a new job application in your pipeline
          </p>
        </div>

        <ApplicationForm resumes={resumes} />
      </div>
    </div>
  )
}