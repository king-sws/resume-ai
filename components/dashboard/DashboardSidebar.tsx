/* eslint-disable react-hooks/preserve-manual-memoization */
// components/dashboard/DashboardSidebar.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  BarChart3,
  Settings,
  Crown,
  Sparkles,
  LogOut,
  User,
  Layers,
  Zap,
  ChevronRight,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useTheme } from 'next-themes'

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

interface DashboardSidebarProps {
  user: User | null
  isMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  color: string
  darkColor: string
  bgColor: string
  darkBgColor: string
  badge?: string
}

// Extract SidebarContent as a separate component outside render
function SidebarContent({ 
  user, 
  navigation, 
  isActive, 
  creditsPercentage, 
  resumePercentage, 
  getPlanColors,
  handleLogout,
  router,
  isDark
}: {
  user: User | null
  navigation: NavigationItem[]
  isActive: (href: string) => boolean
  creditsPercentage: number
  resumePercentage: number
  getPlanColors: () => string
  handleLogout: () => Promise<void>
  router: ReturnType<typeof useRouter>
  isDark: boolean
}) {
  return (
    <div className="flex flex-col h-full bg-[#191a1aee] text-gray-100">
      {/* Header/Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-700">
        <Link href="/" className="inline-block">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">ResumeAI</span>
              <span className="text-xs text-gray-400">Resume Builder</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-6 custom-scrollbar">
        {/* User Profile Card */}
        <div className="px-3 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-9 w-9 border border-gray-600">
              <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-primary text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate text-white">
                {user?.name || 'User'}
              </span>
              {/* <div className="flex items-center gap-1.5">
                <Badge variant="outline" className={cn("text-xs px-1.5 py-0 h-4 border", getPlanColors())}>
                  {user?.plan || 'FREE'}
                </Badge>
                {(user?.plan === 'PRO' || user?.plan === 'ENTERPRISE') && (
                  <Crown className="h-3 w-3 text-yellow-400" />
                )}
              </div> */}
            </div>
          </div>

          {/* AI Credits */}
          {/* <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">AI Credits</span>
              <span className="font-medium text-gray-200">
                {user?.usageStats?.aiCreditsUsed || 0}/{user?.usageStats?.aiCreditsLimit || 10}
              </span>
            </div>
            <Progress 
              value={creditsPercentage} 
              className="h-1.5 bg-gray-700"
            />
          </div> */}

          {/* Resume Limit (for FREE users) */}
          {/* {user?.plan === 'FREE' && user?.usageStats && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Resumes</span>
                <span className="font-medium text-gray-200">
                  {user.usageStats.resumesCreated}/{user.usageStats.resumesLimit}
                </span>
              </div>
              <Progress 
                value={resumePercentage} 
                className="h-1.5 bg-gray-700"
              />
            </div>
          )} */}

          {/* Subscription Status */}
          {user?.subscription?.status === 'active' && user?.subscription?.currentPeriodEnd && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Renews</span>
                <span className="font-medium text-gray-200">
                  {format(new Date(user.subscription.currentPeriodEnd), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
  key={item.name}
  href={item.href}
  className={cn(
    "flex items-center gap-3 py-2 px-3 rounded-md transition-all group relative",
    active
      ? "bg-cyan-400/10 text-white border-l-2 border-cyan-400"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
  )}
>
  <div
    className={cn(
      "w-6 h-6 rounded-md flex items-center justify-center transition-all",
      active ? "bg-cyan-400/20" : "bg-transparent group-hover:bg-gray-700"
    )}
  >
    <Icon
      className={cn(
        "h-4 w-4 transition-transform group-hover:scale-110",
        active ? "text-cyan-400" : item.darkColor
      )}
    />
  </div>

  <span className="text-sm flex-1">{item.name}</span>

  {item.badge && (
    <Badge
      variant="secondary"
      className="text-xs px-1.5 py-0 h-4 bg-gray-700 text-gray-200 border-gray-600"
    >
      {item.badge}
    </Badge>
  )}
</Link>

            )
          })}
        </nav>

        {/* Upgrade Card */}
        {/* {user?.plan === 'FREE' && (
          <div className="mx-1 rounded-lg border border-primary/30 bg-gradient-to-br from-yellow-600 to-[#1d6b40] p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">
              Unlimited resumes, AI credits & premium templates
            </p>
            <Button asChild size="sm" className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-white">
              <Link href="/dashboard/upgrade">
                <Crown className="h-3 w-3 mr-1" />
                Upgrade Now
              </Link>
            </Button>
          </div>
        )} */}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors text-left">
              <Avatar className="h-9 w-9 border border-gray-600">
                <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-primary text-white">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-medium truncate text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-gray-800 border-gray-700"
          >
            <div className="p-2 text-xs text-gray-400">
              {user?.email}
            </div>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
              onClick={() => router.push('/dashboard/profile')}
            >
              <User className="h-4 w-4 mr-2 text-gray-400" /> Profile 
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Settings className="h-4 w-4 mr-2 text-gray-400" /> Settings
            </DropdownMenuItem>
            {user?.plan !== 'FREE' && (
              <DropdownMenuItem 
                className="cursor-pointer text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push('/dashboard/billing')}
              >
                <Crown className="h-4 w-4 mr-2 text-yellow-400" /> Billing
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-400 hover:bg-gray-700 hover:text-red-300 focus:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function DashboardSidebar({ user, isMobileOpen: externalMobileOpen, onMobileOpenChange }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Use external state if provided, otherwise use internal state
  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen
  const setIsMobileOpen = onMobileOpenChange || setInternalMobileOpen

  const navigation: NavigationItem[] = useMemo(() => [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      darkColor: 'text-blue-400',
      bgColor: 'bg-blue-50',
      darkBgColor: 'bg-blue-900/30'
    },
    {
      name: 'Resumes',
      href: '/dashboard/resumes',
      icon: FileText,
      color: 'text-green-500',
      darkColor: 'text-green-400',
      bgColor: 'bg-green-50',
      darkBgColor: 'bg-green-900/30',
      badge: user?.usageStats?.resumesCreated.toString()
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: Layers,
      color: 'text-purple-500',
      darkColor: 'text-purple-400',
      bgColor: 'bg-purple-50',
      darkBgColor: 'bg-purple-900/30'
    },
    {
      name: 'Applications',
      href: '/dashboard/applications',
      icon: Briefcase,
      color: 'text-amber-500',
      darkColor: 'text-amber-400',
      bgColor: 'bg-amber-50',
      darkBgColor: 'bg-amber-900/30'
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai-assistant',
      icon: Sparkles,
      color: 'text-indigo-500',
      darkColor: 'text-indigo-400',
      bgColor: 'bg-indigo-50',
      darkBgColor: 'bg-indigo-900/30'
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      color: 'text-red-500',
      darkColor: 'text-red-400',
      bgColor: 'bg-red-50',
      darkBgColor: 'bg-red-900/30'
    }
  ], [user?.usageStats?.resumesCreated])

  const isActive = useCallback((href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }, [pathname])

  const creditsPercentage = useMemo(() => {
    return user?.usageStats 
      ? Math.min((user.usageStats.aiCreditsUsed / user.usageStats.aiCreditsLimit) * 100, 100)
      : 0
  }, [user?.usageStats])

  const resumePercentage = useMemo(() => {
    return user?.usageStats && user.usageStats.resumesLimit > 0
      ? Math.min((user.usageStats.resumesCreated / user.usageStats.resumesLimit) * 100, 100)
      : 0
  }, [user?.usageStats])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/auth/sign-in'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  // Close mobile menu when pathname changes (proper way)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileOpen(false)
    }
    
    // Only set if it's different from current state
    if (isMobileOpen) {
      handleRouteChange()
    }
  }, [pathname, isMobileOpen])

  // Get plan colors - Updated for dark theme
  const getPlanColors = useCallback(() => {
    switch (user?.plan) {
      case 'FREE':
        return 'bg-gray-700/50 text-gray-300 border-gray-600'
      case 'PRO':
        return 'bg-blue-900/30 text-blue-300 border-blue-700/50'
      case 'ENTERPRISE':
        return 'bg-purple-900/30 text-purple-300 border-purple-700/50'
      default:
        return 'bg-gray-700/50 text-gray-300 border-gray-600'
    }
  }, [user?.plan])

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden lg:block h-full w-64 border-r border-gray-700 bg-[#191a1aee] z-40">
        <SidebarContent 
          user={user}
          navigation={navigation}
          isActive={isActive}
          creditsPercentage={creditsPercentage}
          resumePercentage={resumePercentage}
          getPlanColors={getPlanColors}
          handleLogout={handleLogout}
          router={router}
          isDark={isDark}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent 
          side="left" 
          className="w-72 p-0 bg-[#191a1aee] border-r border-gray-700"
        >
          <div className="flex justify-end p-2 lg:hidden">
            <SheetClose asChild />
          </div>
          <SidebarContent 
            user={user}
            navigation={navigation}
            isActive={isActive}
            creditsPercentage={creditsPercentage}
            resumePercentage={resumePercentage}
            getPlanColors={getPlanColors}
            handleLogout={handleLogout}
            router={router}
            isDark={isDark}
          />
        </SheetContent>
      </Sheet>

      {/* Offset for Desktop */}
      <div className="hidden lg:block w-64" />
    </>
  )
}