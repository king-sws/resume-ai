/* eslint-disable react/no-unescaped-entities */
// components/dashboard/ResumeFilters.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, FileText, CheckCircle2, Archive, Edit3, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Stats {
  all: number
  draft: number
  active: number
  archived: number
}

interface ResumeFiltersProps {
  stats: Stats
  currentStatus?: string
  currentSearch?: string
}

export function ResumeFilters({ stats, currentStatus, currentSearch }: ResumeFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch || '')
  const [isPending, startTransition] = useTransition()

  const filters = [
    { 
      label: 'All Resumes', 
      value: '', 
      count: stats.all, 
      icon: FileText,
      color: '#50a3f8',
      bgColor: '#50a3f810',
      borderColor: '#50a3f830'
    },
    { 
      label: 'Drafts', 
      value: 'DRAFT', 
      count: stats.draft, 
      icon: Edit3,
      color: '#f59e0b',
      bgColor: '#f59e0b10',
      borderColor: '#f59e0b30'
    },
    { 
      label: 'Active', 
      value: 'ACTIVE', 
      count: stats.active, 
      icon: CheckCircle2,
      color: '#2fabb8',
      bgColor: '#2fabb810',
      borderColor: '#2fabb830'
    },
    { 
      label: 'Archived', 
      value: 'ARCHIVED', 
      count: stats.archived, 
      icon: Archive,
      color: '#6b7280',
      bgColor: '#6b728010',
      borderColor: '#6b728030'
    },
  ]

  const handleFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    
    startTransition(() => {
      router.push(`/dashboard/resumes?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchValue) {
      params.set('search', searchValue)
    } else {
      params.delete('search')
    }
    
    startTransition(() => {
      router.push(`/dashboard/resumes?${params.toString()}`)
    })
  }

  const handleClearFilters = () => {
    setSearchValue('')
    startTransition(() => {
      router.push('/dashboard/resumes')
    })
  }

  const hasActiveFilters = currentStatus || currentSearch

  return (
    <div className="space-y-6">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = filter.value === (currentStatus || '')
          
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              disabled={isPending}
              className="relative group transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div 
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200
                  ${isActive ? 'shadow-lg' : 'hover:shadow-md'}
                `}
                style={{
                  backgroundColor: isActive ? filter.bgColor : '#242525',
                  borderColor: isActive ? filter.color : '#2a2b2b',
                  borderWidth: isActive ? '2px' : '1px'
                }}
              >
                {/* Icon */}
                <div 
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? `${filter.color}20` : '#2a2b2b'
                  }}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ color: isActive ? filter.color : '#9ca3af' }}
                  />
                </div>

                {/* Label and Count */}
                <div className="flex items-center gap-3">
                  <span 
                    className="font-medium text-sm whitespace-nowrap"
                    style={{ color: isActive ? '#ffffff' : '#9ca3af' }}
                  >
                    {filter.label}
                  </span>
                  
                  <div 
                    className="px-2.5 py-1 rounded-full text-xs font-bold min-w-[32px] text-center"
                    style={{
                      backgroundColor: isActive ? filter.color : '#2a2b2b',
                      color: isActive ? '#ffffff' : '#9ca3af'
                    }}
                  >
                    {filter.count}
                  </div>
                </div>

                {/* Active Indicator */}
                {/* {isActive && (
                  <div 
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse"
                    style={{ 
                      backgroundColor: filter.color,
                      borderColor: '#191a1a'
                    }}
                  />
                )} */}
              </div>
            </button>
          )
        })}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search resumes by title or description..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-12 h-12 bg-[#242525] border-[#2a2b2b] text-white placeholder:text-[#6b7280] focus:border-[#50a3f8] focus:ring-1 focus:ring-[#50a3f8] transition-all duration-200"
              disabled={isPending}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[#2a2b2b] transition-colors duration-200"
              >
                <X className="w-4 h-4 text-[#9ca3af]" />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isPending}
            className="h-12 px-6 bg-[#50a3f8] hover:bg-[#3d8dd9] text-white font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Search
          </Button>
        </form>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={isPending}
            className="h-12 px-6 bg-transparent border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b] hover:text-white transition-all duration-200"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center p-4 bg-[#242525] border border-[#2a2b2b] rounded-xl">
          <span className="text-sm font-medium text-[#9ca3af]">Active filters:</span>
          {currentStatus && (
            <span 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border"
              style={{
                backgroundColor: filters.find(f => f.value === currentStatus)?.bgColor || '#50a3f810',
                color: filters.find(f => f.value === currentStatus)?.color || '#50a3f8',
                borderColor: filters.find(f => f.value === currentStatus)?.borderColor || '#50a3f830'
              }}
            >
              <span>Status: {currentStatus}</span>
              <button
                onClick={() => handleFilterChange('')}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentSearch && (
            <span 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#50a3f810] text-[#50a3f8] border border-[#50a3f830]"
            >
              <span>Search: "{currentSearch}"</span>
              <button
                onClick={() => {
                  setSearchValue('')
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('search')
                  startTransition(() => {
                    router.push(`/dashboard/resumes?${params.toString()}`)
                  })
                }}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}