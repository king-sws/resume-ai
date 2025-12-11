// components/applications/ApplicationFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Stats {
  total: number
  wishlist: number
  applied: number
  screening: number
  interview: number
  offer: number
  accepted: number
  rejected: number
  withdrawn: number
}

interface ApplicationFiltersProps {
  stats: Stats
  currentStatus?: string
  currentSearch?: string
  viewMode: 'board' | 'list'
  onViewModeChange: (mode: 'board' | 'list') => void
}

export function ApplicationFilters({
  stats,
  currentStatus,
  currentSearch,
  viewMode,
  onViewModeChange,
}: ApplicationFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentSearch || '')

  const filters = [
    { label: 'All', value: '', count: stats.total },
    { label: 'Wishlist', value: 'WISHLIST', count: stats.wishlist },
    { label: 'Applied', value: 'APPLIED', count: stats.applied },
    { label: 'Screening', value: 'SCREENING', count: stats.screening },
    { label: 'Interview', value: 'INTERVIEW', count: stats.interview },
    { label: 'Offer', value: 'OFFER', count: stats.offer },
    { label: 'Accepted', value: 'ACCEPTED', count: stats.accepted },
    { label: 'Rejected', value: 'REJECTED', count: stats.rejected },
  ]

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams?.toString())
    if (searchInput) {
      params.set('search', searchInput)
    } else {
      params.delete('search')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchInput('')
    router.push(pathname)
  }

  return (
    <div className="space-y-4">
      {/* Search and View Mode */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by company, position, or location..."
              className="w-full pl-10 pr-4 py-3 bg-[#242525] border border-[#2a2b2b] rounded-xl text-white placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#50a3f8] transition-all"
            />
          </div>
        </form>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onViewModeChange('board')}
            className={
              viewMode === 'board'
                ? 'bg-[#50a3f8] hover:bg-[#3d8dd9] text-white'
                : 'border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b] bg-transparent'
            }
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onViewModeChange('list')}
            className={
              viewMode === 'list'
                ? 'bg-[#50a3f8] hover:bg-[#3d8dd9] text-white'
                : 'border-[#2a2b2b] text-[#9ca3af] hover:bg-[#2a2b2b] bg-transparent'
            }
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleStatusChange(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              (currentStatus === filter.value) || (!currentStatus && !filter.value)
                ? 'bg-[#50a3f8] text-white'
                : 'bg-[#242525] text-[#9ca3af] hover:bg-[#2a2b2b] border border-[#2a2b2b]'
            }`}
          >
            {filter.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              (currentStatus === filter.value) || (!currentStatus && !filter.value)
                ? 'bg-white/20'
                : 'bg-[#2a2b2b]'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {(currentStatus || currentSearch) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#9ca3af]">Active filters:</span>
          {currentStatus && (
            <span className="px-3 py-1 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] border border-[#50a3f8]/20">
              Status: {currentStatus}
            </span>
          )}
          {currentSearch && (
            <span className="px-3 py-1 rounded-full bg-[#50a3f8]/10 text-[#50a3f8] border border-[#50a3f8]/20">
              Search: {currentSearch}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-[#ef4444] hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}