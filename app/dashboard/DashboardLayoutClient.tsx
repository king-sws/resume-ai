// app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#191a1a]">
      {/* Sidebar - Always fixed */}
      <DashboardSidebar 
        user={user} 
        isMobileOpen={isMobileMenuOpen}
        onMobileOpenChange={setIsMobileMenuOpen}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      {/* Main Content Area - Dynamic padding based on sidebar state */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Header */}
        <DashboardHeader 
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  )
}