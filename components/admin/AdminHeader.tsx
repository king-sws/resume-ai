// components/admin/AdminHeader.tsx
'use client'

import { Bell, Search } from 'lucide-react'

interface AdminHeaderProps {
  user: {
    name: string | null
    email: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50a3f8]"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {user.name || 'Admin'}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#50a3f8] to-[#2fabb8] flex items-center justify-center text-white font-semibold">
            {user.name?.[0] || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}