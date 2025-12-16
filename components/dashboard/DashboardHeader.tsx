// components/dashboard/DashboardHeader.tsx
'use client'

import { useState } from 'react'
import { Bell, Search, Plus, Crown, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DashboardHeaderProps {
  user: {
    name: string | null
    plan: string
  } | null
  onMenuClick?: () => void
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header 
      className="sticky top-0 z-30 border-b backdrop-blur-sm"
      style={{ 
        backgroundColor: '#191a1aee',
        borderColor: '#2a2b2b'
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Menu Button & Search Bar */}
        <div className="flex items-center gap-3 flex-1">
          {/* Hamburger Menu - Only visible on mobile/tablet */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: '#242525',
              color: '#7e7e7e'
            }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: '#7e7e7e' }}
              />
              <input
                type="text"
                placeholder="Search resumes, templates, applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: '#242525',
                  color: '#ffffff',
                  borderWidth: '1px',
                  borderColor: '#2a2b2b',
                  borderStyle: 'solid'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#50a3f8'
                  e.target.style.boxShadow = '0 0 0 3px rgba(80, 163, 248, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2a2b2b'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 ml-4">
          {/* Create Button - Desktop */}
          <Link href="/dashboard/resumes/new" className="hidden sm:block">
            <Button 
              size="sm"
              className="transition-all hover:scale-105"
              style={{ 
                backgroundColor: '#50a3f8',
                color: '#ffffff'
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Resume
            </Button>
          </Link>

          {/* Upgrade Button for Free Users */}
          {user?.plan === 'FREE' && (
            <Link href="/dashboard/upgrade" className="hidden md:block">
              <Button 
                size="sm"
                variant="outline"
                className="transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#50a3f8',
                  color: '#50a3f8'
                }}
              >
                <Crown className="w-4 h-4 mr-1.5" />
                Upgrade
              </Button>
            </Link>
          )}

          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg transition-all hover:scale-110"
            style={{ 
              backgroundColor: '#242525',
              color: '#7e7e7e'
            }}
          >
            <Bell className="w-5 h-5" />
            <span 
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#50a3f8' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Create Button */}
      <div className="sm:hidden px-4 pb-3">
        <Link href="/dashboard/resumes/new" className="block">
          <Button 
            size="sm"
            className="w-full"
            style={{ 
              backgroundColor: '#50a3f8',
              color: '#ffffff'
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New Resume
          </Button>
        </Link>
      </div>
    </header>
  )
}