// app/(marketing)/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (session?.user) {
    // If user is authenticated, redirect to dashboard
    redirect('/dashboard')
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
    </div>
  )
}