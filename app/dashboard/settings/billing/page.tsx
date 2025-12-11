// app/dashboard/settings/billing/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { BillingClient } from '@/components/settings/BillingClient'

export default async function BillingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      usageStats: true,
    },
  })

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Get recent AI interactions for usage history
  const recentInteractions = await prisma.aIInteraction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      type: true,
      createdAt: true,
      tokensUsed: true,
    },
  })

  return (
    <BillingClient
      user={{
        name: user.name,
        email: user.email,
        plan: user.plan,
      }}
      subscription={user.subscription ?? null}
      usageStats={{
        resumesCreated: user.usageStats?.resumesCreated || 0,
        resumesLimit: user.usageStats?.resumesLimit || 1,
        aiCreditsUsed: user.usageStats?.aiCreditsUsed || 0,
        aiCreditsLimit: user.usageStats?.aiCreditsLimit || 10,
        totalViews: user.usageStats?.totalViews || 0,
        totalDownloads: user.usageStats?.totalDownloads || 0,
        lastResetAt: user.usageStats?.lastResetAt || new Date(),
      }}
      recentInteractions={recentInteractions}
    />
  )
}