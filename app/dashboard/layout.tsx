// app/dashboard/layout.tsx (Server Component)
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import DashboardLayoutClient from './DashboardLayoutClient'
import { Toaster } from 'sonner'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Fetch user data for layout
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      usageStats: true,
      subscription: true
    }
  })

  if (!user) {
    redirect('/auth/sign-in')
  }

  return <DashboardLayoutClient user={user}>
    {children}
    <Toaster />
    </DashboardLayoutClient>
}