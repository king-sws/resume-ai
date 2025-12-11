// app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

interface UsageStats {
  aiCreditsUsed: number
  aiCreditsLimit: number
  resumesCreated: number
  resumesLimit: number
}

interface Subscription {
  status: string | null
  currentPeriodEnd: Date | null
}

interface User {
  id: string
  name: string | null
  email: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  image: string | null
  usageStats: UsageStats | null
  subscription: Subscription | null
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User | null
}

export default function DashboardLayoutClient({ children, user }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#191a1a]">
      {/* Sidebar - Always fixed */}
      <DashboardSidebar 
        user={user} 
        isMobileOpen={isMobileMenuOpen}
        onMobileOpenChange={setIsMobileMenuOpen}
      />

      {/* Main Content Area - Push right on desktop */}
      <div className="lg:pl-64">
        {/* Header */}
        <DashboardHeader 
          user={user}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}