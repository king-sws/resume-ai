// components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  FileText,
  Users,
  Crown,
  Settings,
  BarChart3,
  Sparkles,
  Shield
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Templates',
      href: '/admin/templates',
      icon: FileText,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: Crown,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'AI Usage',
      href: '/admin/ai-usage',
      icon: Sparkles,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 bg-[#0f0f0f] border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-[#50a3f8] to-[#2fabb8]">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">Admin Panel</p>
            <p className="text-xs text-gray-400">Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-linear-to-r from-[#50a3f8] to-[#2fabb8] text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Back to Dashboard */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>
    </aside>
  )
}