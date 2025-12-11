// app/dashboard/upgrade/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { PricingClient } from '@/components/pricing/PricingClient'

export default async function UpgradePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Get user with subscription info
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

  const currentPlan = user.plan
  const subscriptionStatus = user.subscription?.status
  const currentPeriodEnd = user.subscription?.currentPeriodEnd

  return (
    <PricingClient
      currentPlan={currentPlan}
      subscriptionStatus={subscriptionStatus || null}
      currentPeriodEnd={currentPeriodEnd || null}
      usageStats={{
        resumesCreated: user.usageStats?.resumesCreated || 0,
        resumesLimit: user.usageStats?.resumesLimit || 1,
        aiCreditsUsed: user.usageStats?.aiCreditsUsed || 0,
        aiCreditsLimit: user.usageStats?.aiCreditsLimit || 10,
      }}
    />
  )
}