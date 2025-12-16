// app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import prisma from '@/lib/db'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/sign-in')
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, email: true },
  })

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}