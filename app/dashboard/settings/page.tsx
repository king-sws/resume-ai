// app/dashboard/settings/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileSettings } from '@/components/settings/ProfileSettings'
import { APIKeySettings } from '@/components/settings/APIKeySettings'
import { UsageStats } from '@/components/settings/UsageStats'
import prisma from '@/lib/db'
import { AccountSettings } from '@/components/settings/AccountSettings'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch user data with usage stats
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      usageStats: true,
      subscription: true,
    },
  })

  if (!user) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <ProfileSettings user={user} />

        {/* API Keys */}
        <APIKeySettings />

        {/* Usage Stats */}
        <UsageStats 
          plan={user.plan}
          usageStats={user.usageStats}
        />

        {/* Account Settings */}
        <AccountSettings
          user={user}
          subscription={user.subscription}
        />
      </div>
    </div>
  )
}