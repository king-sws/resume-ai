// app/dashboard/ai-assistant/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { AIAssistantPageClient } from '@/components/ai/IAssistantPageClient'

export default async function AIAssistantPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Get user's resumes for context
  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      status: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Get usage stats
  const usageStats = await prisma.usageStats.findUnique({
    where: { userId: session.user.id },
  })

  // Get recent AI interactions
  const recentInteractions = await prisma.aIInteraction.findMany({
    where: { 
      userId: session.user.id,
      type: 'SUGGEST', // Chat interactions
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      prompt: true,
      response: true,
      createdAt: true,
    },
  })

  return (
    <AIAssistantPageClient
      resumes={resumes}
      creditsUsed={usageStats?.aiCreditsUsed || 0}
      creditsLimit={usageStats?.aiCreditsLimit || 10}
      recentInteractions={recentInteractions}
    />
  )
}